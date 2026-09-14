"use server";

import { requireSession } from "@/core/auth/lib/require-session";
import { db } from "@/shared/db/client";
import { user, userRole, userProfile } from "@/core/auth/schema/auth.schema";
// Commented out until moderation module is built:
// import { auditLog } from "@/shared/communication/moderation/schema/moderation.schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface UpdateUserFieldPayload {
    targetUserId: string;
    field: "name" | "email" | "bio" | "role";
    newValue: string;
}

export async function updateUserAdminAction(payload: UpdateUserFieldPayload) {
    // 1. Enforce administrative session
    const session = await requireSession({ role: "admin" });
    const _adminUserId = session.user.id;

    const { targetUserId, field, newValue } = payload;

    let _oldValue = "";

    // 2. Perform field-specific updates
    if (field === "name") {
        const [existing] = await db.select({ name: user.name }).from(user).where(eq(user.id, targetUserId));
        _oldValue = existing?.name || "";
        await db.update(user).set({ name: newValue, updatedAt: new Date() }).where(eq(user.id, targetUserId));
    } else if (field === "email") {
        const [existing] = await db.select({ email: user.email }).from(user).where(eq(user.id, targetUserId));
        _oldValue = existing?.email || "";
        await db.update(user).set({ email: newValue, updatedAt: new Date() }).where(eq(user.id, targetUserId));
    } else if (field === "bio") {
        const [existing] = await db.select({ bio: userProfile.bio }).from(userProfile).where(eq(userProfile.userId, targetUserId));
        _oldValue = existing?.bio || "";
        await db
            .insert(userProfile)
            .values({ id: `prof_${targetUserId}`, userId: targetUserId, bio: newValue })
            .onConflictDoUpdate({ target: userProfile.userId, set: { bio: newValue, updatedAt: new Date() } });
    } else if (field === "role") {
        const currentRoles = await db.select().from(userRole).where(eq(userRole.userId, targetUserId));
        _oldValue = currentRoles.map((r) => r.roleId).join(", ") || "none";

        // Clear existing roles and assign selected role
        await db.delete(userRole).where(eq(userRole.userId, targetUserId));
        await db.insert(userRole).values({ userId: targetUserId, roleId: newValue });
    }

    // 3. Write immutable record to Audit Log (Commented out until module is built)

    await db.insert(auditLog).values({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorUserId: _adminUserId,
      actionType: "USER_EDITED",
      targetModule: "USERS",
      targetRecordId: targetUserId,
      targetUserId: targetUserId,
      metadata: {
        field,
        oldValue: _oldValue,
        newValue,
      },
      createdAt: new Date(),
    });

    revalidatePath("/admin/users");
    return { success: true };
}
