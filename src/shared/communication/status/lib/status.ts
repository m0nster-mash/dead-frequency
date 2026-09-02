import {randomUUID} from "crypto";
import {and, eq, isNull, or} from "drizzle-orm";
import {db} from "@shared/db/client";
import {userStatus} from "../schema/status.schema";
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
