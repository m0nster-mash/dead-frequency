import { db } from "@/shared/db/client";
import {
    user,
    userRole,
    role,
    userProfile,
    userStats,
} from "@/core/auth/schema/auth.schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export interface UserDetails {
    user: typeof user.$inferSelect;
    roles: Array<{
        roleId: string;
        name: string;
        description: string | null;
        bypassesCooldown: boolean;
    }>;
    profile: typeof userProfile.$inferSelect | null;
    stats: {
        userId: string;
        forumPostCount: number;
        chatMessageCount: number;
        chatboxMessageCount: number;
        commentCount: number;
        trustScore: number;
        lastPostedAt: Date | null;
    };
}

/**
 * Fetches core user details, assigned RBAC roles, profile info, and activity stats.
 * Triggers `notFound()` automatically if the core user record does not exist.
 */
export async function getUserDetails(userId: string): Promise<UserDetails> {
    // 1. Core user record
    const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

    if (!targetUser) {
        notFound();
    }

    // 2. Assigned roles via user_role junction table
    const assignedRoles = await db
        .select({
            roleId: role.id,
            name: role.name,
            description: role.description,
            bypassesCooldown: role.bypassesCooldown,
        })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(eq(userRole.userId, userId));

    // 3. User profile extension
    const [profile] = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, userId));

    // 4. User activity statistics & trust score
    const [statsRow] = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId));

    const stats = statsRow || {
        userId,
        forumPostCount: 0,
        chatMessageCount: 0,
        chatboxMessageCount: 0,
        commentCount: 0,
        trustScore: 0,
        lastPostedAt: null,
    };

    return {
        user: targetUser,
        roles: assignedRoles,
        profile: profile || null,
        stats,
    };
}
