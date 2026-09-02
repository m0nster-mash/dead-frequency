import {randomUUID} from "crypto";
import {and, eq, isNull, or, sql} from "drizzle-orm";
import {db} from "@shared/db/client";
import {userStatus, userTrust} from "../schema/status.schema";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";
import {logModAction} from "@shared/communication/moderation/lib/audit-log";

type Module = (typeof moduleEnum.enumValues)[number];

/**
 * The single read every module must call before accepting a post/message.
 * Checks module-scoped status first, falls back to site-wide.
 */
export async function getPostingStatus(userId: string, module: Module) {
    const rows = await db
        .select()
        .from(userStatus)
        .where(
            and(
                eq(userStatus.userId, userId),
                or(eq(userStatus.module, module), isNull(userStatus.module)),
            ),
        );

    const now = new Date();
    const active = rows
        .filter((row) => !row.expiresAt || row.expiresAt > now)
        // module-scoped row wins over site-wide if both exist
        .sort((a) => (a.module ? -1 : 1));

    return active[0]?.status ?? "active";
}

/**
 * Admin-facing mutation. Always routes through logModAction so every
 * mute/shadowban/ban shows up in the unified audit log automatically —
 * callers never write to auditLog directly.
 */
export async function setPostingStatus(input: {
    userId: string;
    module: Module | null;
    status: "active" | "muted" | "shadowbanned" | "banned";
    moderatorId: string;
    reason?: string;
    expiresAt?: Date | null;
}) {
    await db
        .insert(userStatus)
        .values({
            id: randomUUID(),
            userId: input.userId,
            module: input.module ?? undefined,
            status: input.status,
            reason: input.reason ?? null,
            expiresAt: input.expiresAt ?? null,
        })
        .onConflictDoUpdate({
            target: [userStatus.userId, userStatus.module],
            set: {
                status: input.status,
                reason: input.reason ?? null,
                expiresAt: input.expiresAt ?? null,
                updatedAt: new Date(),
            },
        });

    const actionMap = {
        active: "unmute",
        muted: "mute",
        shadowbanned: "shadowban",
        banned: "ban",
    } as const;

    await logModAction({
        module: input.module ?? "forum", // pick the module enum requires; consider a "site" enum value if you want true site-wide entries
        recordId: input.userId,
        action: actionMap[input.status],
        moderatorId: input.moderatorId,
        targetUserId: input.userId,
        reason: input.reason ?? null,
    });
}

const PROMOTION_THRESHOLDS = {
    basic: 5,
    trusted: 50,
    veteran: 250,
} as const;

const COOLDOWN_MS = {
    new: 60_000, // 1 post/minute until promoted
    basic: 15_000,
} as const;

/**
 * Call before accepting any post/message, alongside sanitizeContent and
 * getPostingStatus. Cheap first anti-spam layer per the issue's plan.
 */
export async function canPost(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const [row] = await db
        .select()
        .from(userTrust)
        .where(eq(userTrust.userId, userId))
        .limit(1);

    if (!row) return {allowed: true}; // first-ever post, row created on record

    if (row.trustLevel === "restricted") {
        return {allowed: false, reason: "Account posting privileges are restricted."};
    }

    if (row.cooldownUntil && row.cooldownUntil > new Date()) {
        return {allowed: false, reason: "You're posting too quickly. Please wait a moment."};
    }

    return {allowed: true};
}

/** Call after a successful post save. */
export async function recordPost(userId: string) {
    const cooldownMs = COOLDOWN_MS.new; // refine per-level after reading current row if desired

    await db
        .insert(userTrust)
        .values({
            userId,
            postCount: 1,
            cooldownUntil: new Date(Date.now() + cooldownMs),
        })
        .onConflictDoUpdate({
            target: userTrust.userId,
            set: {
                postCount: sql`${userTrust.postCount}
                + 1`,
                cooldownUntil: new Date(Date.now() + cooldownMs),
                updatedAt: new Date(),
            },
        });

    await recalculateTrustLevel(userId);
}

async function recalculateTrustLevel(userId: string) {
    const [row] = await db.select().from(userTrust).where(eq(userTrust.userId, userId)).limit(1);
    if (!row || row.trustLevel === "restricted") return;

    const level =
        row.postCount >= PROMOTION_THRESHOLDS.veteran ? "veteran" :
            row.postCount >= PROMOTION_THRESHOLDS.trusted ? "trusted" :
                row.postCount >= PROMOTION_THRESHOLDS.basic ? "basic" : "new";

    if (level !== row.trustLevel) {
        await db.update(userTrust).set({trustLevel: level}).where(eq(userTrust.userId, userId));
    }
}

/** Called when a user is blocked/reported/muted — feeds the "ranking" idea. */
export async function recordNegativeSignal(userId: string) {
    await db
        .insert(userTrust)
        .values({userId, negativeSignalCount: 1})
        .onConflictDoUpdate({
            target: userTrust.userId,
            set: {
                negativeSignalCount: sql`${userTrust.negativeSignalCount}
                + 1`
            },
        });

    const [row] = await db.select().from(userTrust).where(eq(userTrust.userId, userId)).limit(1);
    if (row && row.negativeSignalCount >= 10 && row.trustLevel !== "restricted") {
        await db.update(userTrust).set({trustLevel: "restricted"}).where(eq(userTrust.userId, userId));
    }
}
