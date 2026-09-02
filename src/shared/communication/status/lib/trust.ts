import {db} from "@shared/db/client";
import {userTrust} from "../schema/status.schema";
import {eq, sql} from "drizzle-orm";

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

/**
 * Called when a user is blocked/reported/muted — feeds the "ranking" idea.
 * */
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
