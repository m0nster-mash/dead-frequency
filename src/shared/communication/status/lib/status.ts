"use server";

import {logModAction} from "@shared/communication/moderation/lib/audit-log";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";
import {db} from "@shared/db/client";
import {randomUUID} from "crypto";
import {and, eq, isNull, or} from "drizzle-orm";
import {userStatus} from "../schema/status.schema";

/**
 * Extracts and maps standard string classification names from the centralized system module enum.
 */
type Module = (typeof moduleEnum.enumValues)[number];

/**
 * The single query entry point every content-bearing module must call before accepting an entry or post. Evaluates
 * active security restrictions pinned against accounts, fallback-merging site-wide parameters.
 *
 * Technical filtering logic:
 * 1. Pulls restriction rows filtering by strict equality checks matching `userId`.
 * 2. Matches records assigned explicitly to the requested content feature module OR site-wide blocks (`module` is null).
 * 3. Prunes expired restrictions out of consideration loops by validating timestamps against the running system clock.
 * 4. Sorts records so that granular, module-scoped restrictions override broader site-wide defaults.
 *
 * @param {string} userId - The unique account identification key string matching the active submission session.
 * @param {Module} module - The specific sub-system feature scope requesting the status verification check (ex. "forum").
 *
 * @returns {Promise<"active" | "muted" | "shadowbanned" | "banned">} A promise resolving to the dominant restrictive
 *                                                                    enforcement state.
 */
export async function getPostingStatus(userId: string, module: Module): Promise<"active" | "muted" | "shadowbanned" | "banned"> {
    // Extracts matching systemic constraints and blocks from the status data layer
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

    // Process matching restriction data blocks
    const active = rows
        // Discards restrictions if their saved validity time boundaries have passed
        .filter((row) => !row.expiresAt || row.expiresAt > now)
        /**
         * Arranges array tracks so that localized module rows (`a.module` is true) sit ahead of global records,
         * guaranteeing specific block parameters win if conflicting configurations exist.
         */
        .sort((a) => (a.module ? -1 : 1));

    // Fallback parameter guard: defaults to standard uninhibited "active" system clearance if no rows pass rules
    return (active[0]?.status as "active" | "muted" | "shadowbanned" | "banned") ?? "active";
}

/**
 * High-security administrative mutation utility that updates or inserts restriction profiles for a user account.
 * Automatically synchronizes changes out to the centralized compliance ledger via standard audit logger utilities.
 *
 * Secure processing flow:
 * 1. Executes an atomic PostgreSQL upsert mutation (`onConflictDoUpdate`) on compound target constraints
 *   (`userId` + `module`).
 * 2. Resets parameter rows, fallback-mapping empty optional parameters down to clean database null fields.
 * 3. References a static action key translation dictionary to convert current target statuses into historical action
 *    verbs.
 * 4. Dispatches logging parameters down into the centralized `logModAction` audit timeline loop to meet tracking
 *    criteria.
 *
 * Feature code paths must always route modification states through this action method instead of writing directly to
 * logs.
 *
 * @param {Object} input - Structural payload arguments tracking the adjustment operation.
 * @param {string} input.userId - The unique destination target user profile receiving the posture adjustment.
 * @param {Module | null} input.module - Target feature system scope being restricted. Pass `null` to configure a
 *                                       site-wide block.
 * @param {"active" | "muted" | "shadowbanned" | "banned"} input.status - The strict enforcement clearance level state
 *                                                                        being assigned.
 * @param {string} input.moderatorId - The unique user identification key tracking the supervisor running the action
 *                                     script.
 * @param {string} [input.reason] - Optional description copy justifying the administrative standing change.
 * @param {Date | null} [input.expiresAt] - Optional timestamp defining the expiration boundary of the penalty window.
 * @returns {Promise<void>} A promise resolving once data mutations commit and audit tasks successfully complete.
 */
export async function setPostingStatus(input: {
    userId: string;
    module: Module | null;
    status: "active" | "muted" | "shadowbanned" | "banned";
    moderatorId: string;
    reason?: string;
    expiresAt?: Date | null;
}): Promise<void> {

    // Persists standing states cleanly across modular conflict indices via Drizzle ORM
    await db
        .insert(userStatus)
        .values({
            id: randomUUID(),
            userId: input.userId,
            module: input.module ?? undefined, // Maps fallback null parameters up to undefined variables for cleaner inserts
            status: input.status,
            reason: input.reason ?? null,
            expiresAt: input.expiresAt ?? null,
        })
        .onConflictDoUpdate({
            // Locks checks against unique compound column coordinates
            target: [userStatus.userId, userStatus.module],
            set: {
                status: input.status,
                reason: input.reason ?? null,
                expiresAt: input.expiresAt ?? null,
                updatedAt: new Date(), // Forces an explicit refresh tracking step on mutation
            },
        });

    // Standardizes status tags down into historical audit log descriptive verbs
    const actionMap = {
        active: "unmute",
        muted: "mute",
        shadowbanned: "shadowban",
        banned: "ban",
    } as const;

    // Registers details to global panel dashboards automatically
    await logModAction({
        /**
         * Selects target module signatures. If true site-wide metrics are running, fallbacks to "forum" or balances
         * paths out utilizing alternative shared enum labels like "site".
         */
        module: input.module ?? "site",
        recordId: input.userId,
        action: actionMap[input.status],
        moderatorId: input.moderatorId,
        targetUserId: input.userId,
        reason: input.reason ?? null,
    });
}
