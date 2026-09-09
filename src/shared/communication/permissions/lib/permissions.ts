import {db} from "@shared/db/client";
import {and, eq, isNull, or} from "drizzle-orm";
import {userRole} from "../schema/permissions.schema";

/**
 * Centrally evaluates authorization rules by querying if a user possesses a specific role assignment.
 *
 * Secure processing flow:
 * 1. Queries the central `userRole` table using strict equality matching targets (`userId` + `roleId`).
 * 2. Contextual Resolution Rules:
 *    - If a `contextId` is supplied (ex. guild-scoped clearances), it looks for entries assigned explicitly to that
 *      context OR a global entry (`contextId` is null). This provides automatic inheritance.
 *    - If no `contextId` is supplied, it strictly limits the match query scope to global-tier entries.
 * 3. Clamps performance footprints by applying query limit boundaries.
 *
 * Never write ad-hoc "is this user a mod" logic elsewhere — extend this utility instead.
 *
 * @param {string} userId - The unique user identification primary key string of the targeted account.
 * @param {string} roleId - The exact security clearance identifier string being evaluated (ex. "admin", "moderator").
 * @param {string | null} [contextId] - Optional sub-system sandbox or modular boundary tracking tag.
 *
 * @returns {Promise<boolean>} A promise resolving to true if a valid role row assignment exists in database storage.
 */
export async function hasRole(
    userId: string,
    roleId: string,
    contextId?: string | null,
): Promise<boolean> {
    const rows = await db
        .select()
        .from(userRole)
        .where(
            and(
                eq(userRole.userId, userId),
                eq(userRole.roleId, roleId),
                /**
                 * Ensures that global administrative privileges override localized contextual scopes, while preventing
                 * contextual access rights from bleeding back out into global frameworks.
                 */
                contextId
                    ? or(isNull(userRole.contextId), eq(userRole.contextId, contextId))
                    : isNull(userRole.contextId),
            ),
        )
        .limit(1);

    return rows.length > 0;
}

/**
 * TODO:: implement feature or delete function
 *
 * High-performance shortcut wrapper evaluating elevated system privileges. Automatically permits passage if the
 * subject exhibits either absolute administrator or situational moderator rights.
 *
 * @param {string} userId - The unique account identification key string matching the active caller session.
 * @param {string | null} [contextId] - Optional sub-system boundary tracking tag to pass along to evaluation steps.
 *
 * @returns {Promise<boolean>} A promise resolving to true if the account holds verified managerial clearances.
 */
export async function isModerator(userId: string, contextId?: string | null): Promise<boolean> {
    return (await hasRole(userId, "admin", contextId)) || (await hasRole(userId, "moderator", contextId));
}
