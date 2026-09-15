import {role} from "@/core/auth/schema/auth.schema";
import {db} from "@/shared/db/client";
import {ROLE_PERMISSIONS, UserRole} from "@shared/constants/user-role";

export async function seedRoles(): Promise<void> {
    const roleEntries = Object.values(UserRole).map((roleId) => {
        const config = ROLE_PERMISSIONS[roleId];
        return {
            id: roleId,
            name: config.name,
            description: config.description,
            bypassesCooldown: config.bypassesCooldown,
        };
    });

    // Upsert roles into database
    await db
        .insert(role)
        .values(roleEntries)
        .onConflictDoUpdate({
            target: role.id,
            set: {
                name: role.name,
                description: role.description,
                bypassesCooldown: role.bypassesCooldown,
            },
        });

    console.log("Roles successfully seeded.");
}
