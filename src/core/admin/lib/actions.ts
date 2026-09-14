"use server";

import {auth} from "@/core/auth";
import {role, user, userRole} from "@/core/auth/schema/auth.schema";
import {logAuditAction} from "@/shared/communication/moderation/lib/audit-log";
import {userSanction} from "@/shared/communication/moderation/schema/moderation.schema";
import {db} from "@/shared/db/client";
import {and, eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";

/**
 * Validates that the active session belongs to an administrative user.
 */
async function requireAdminSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized: Authentication required.");
    }

    // Check if user has admin role
    const [adminRole] = await db
        .select({userId: userRole.userId})
        .from(userRole)
        .where(and(eq(userRole.userId, session.user.id), eq(userRole.roleId, "admin")))
        .limit(1);

    if (!adminRole && (session.user as { role?: string }).role !== "admin") {
        throw new Error("Forbidden: Admin privileges required.");
    }

    return session.user;
}

/**
 * Assigns or updates a site-wide RBAC role for a target user account.
 */
export async function updateUserRoleAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = await requireAdminSession();
        const targetUserId = formData.get("userId") as string;
        const roleId = formData.get("roleId") as string; // 'admin' | 'moderator' | 'member' | 'newcomer'

        if (!targetUserId || !roleId) {
            return {success: false, error: "Target User ID and Role ID are required."};
        }

        // Verify role exists
        const [existingRole] = await db.select().from(role).where(eq(role.id, roleId)).limit(1);
        if (!existingRole) {
            return {success: false, error: "Specified role does not exist."};
        }

        // Remove existing site roles and assign new role
        await db.delete(userRole).where(eq(userRole.userId, targetUserId));
        await db.insert(userRole).values({
            userId: targetUserId,
            roleId,
            assignedAt: new Date(),
        });

        // Write audit trail
        await logAuditAction({
            moderatorId: admin.id,
            targetUserId,
            module: "users",
            action: "role_change",
            reason: `Assigned site role '${roleId}'`,
            metadata: {newRoleId: roleId},
        });

        revalidatePath(`/admin/users/${targetUserId}`);
        revalidatePath("/admin/users");
        return {success: true};
    } catch (err: unknown) {
        return {success: false, error: err instanceof Error ? err.message : "Failed to update user role."};
    }
}

/**
 * Issues a posting sanction (mute/shadowban/timeout) against a user account.
 */
export async function issueUserSanctionAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = await requireAdminSession();
        const targetUserId = formData.get("userId") as string;
        const sanctionType = formData.get("sanctionType") as string; // 'MUTE' | 'SHADOWBAN' | 'TIMEOUT'
        const targetModule = (formData.get("targetModule") as string) || null; // e.g., 'CHATBOX', 'FORUM' or null for site-wide
        const reason = formData.get("reason") as string;

        if (!targetUserId || !sanctionType || !reason) {
            return {success: false, error: "User ID, Sanction Type, and Reason are required."};
        }

        await db.insert(userSanction).values({
            id: crypto.randomUUID(),
            userId: targetUserId,
            issuedByUserId: admin.id,
            sanctionType,
            targetModule,
            contextId: null,
            reason,
            createdAt: new Date(),
        });

        await logAuditAction({
            moderatorId: admin.id,
            targetUserId,
            module: (targetModule as "chatbox" | "forum" | "users") || "users",
            action: sanctionType === "MUTE" ? "mute" : "ban",
            reason,
            metadata: {sanctionType, targetModule},
        });

        revalidatePath(`/admin/users/${targetUserId}`);
        return {success: true};
    } catch (err: unknown) {
        return {success: false, error: err instanceof Error ? err.message : "Failed to issue user sanction."};
    }
}

/**
 * Soft or hard deletes a user account from the platform.
 */
export async function deleteUserAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = await requireAdminSession();
        const targetUserId = formData.get("userId") as string;
        const reason = formData.get("reason") as string;

        if (!targetUserId) {
            return {success: false, error: "User ID is required."};
        }

        if (targetUserId === admin.id) {
            return {success: false, error: "Administrators cannot delete their own active account."};
        }

        // Delete user (cascades to sessions, userRoles, userStats, and characters)
        const [deletedUser] = await db
            .delete(user)
            .where(eq(user.id, targetUserId))
            .returning();

        if (!deletedUser) {
            return {success: false, error: "User record not found."};
        }

        await logAuditAction({
            moderatorId: admin.id,
            targetUserId,
            module: "users",
            action: "delete",
            reason: reason || "Administrative account removal",
            metadata: {deletedUserName: deletedUser.name, deletedUserEmail: deletedUser.email},
        });

        revalidatePath("/admin/users");
        return {success: true};
    } catch (err: unknown) {
        return {success: false, error: err instanceof Error ? err.message : "Failed to delete user."};
    }
}
