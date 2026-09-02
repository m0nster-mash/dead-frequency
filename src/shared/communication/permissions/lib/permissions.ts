import {and, eq, isNull, or} from "drizzle-orm";
import {db} from "@shared/db/client";
import { userRole } from "../schema/permissions.schema";

/**
 * The one check every module and the admin panel calls. Do not write
 * ad-hoc "is this user a mod" logic elsewhere — extend this instead.
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
                contextId
                    ? or(isNull(userRole.contextId), eq(userRole.contextId, contextId))
                    : isNull(userRole.contextId),
            ),
        )
        .limit(1);

    return rows.length > 0;
}

export async function isModerator(userId: string, contextId?: string | null) {
    return (await hasRole(userId, "admin", contextId)) || (await hasRole(userId, "moderator", contextId));
}
