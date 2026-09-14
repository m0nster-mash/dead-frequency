import { db } from "@/shared/db/client";
import { userRole } from "@/core/auth/schema/auth.schema";
import { eq } from "drizzle-orm";

/**
 * TODO:: rename to 'require-roles.ts`
 *
 * Fetches all assigned role IDs for a given user ID from the user_role junction table.
 */
export async function requireRoles(userId: string): Promise<string[]> {
    const roles = await db
        .select({ roleId: userRole.roleId })
        .from(userRole)
        .where(eq(userRole.userId, userId));

    return roles.map((r) => r.roleId);
}
