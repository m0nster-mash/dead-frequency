import {role} from "@/_shared/communication/permissions/schema/permissions.schema";
import {db} from "@/_shared/db/client";
import {SEED_ROLES} from "@/_shared/db/seed/seed-config";

export async function seedRoles(): Promise<void> {
    try {
        await db
            .insert(role)
            .values([...SEED_ROLES])
            .onConflictDoNothing();

        console.log(`✓ Seeded ${SEED_ROLES.length} roles`);
    } catch (error) {
        console.error("Failed to seed roles:", error);
        throw error;
    }
}
