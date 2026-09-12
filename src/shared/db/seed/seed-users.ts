import { user, account } from "@/core/auth/schema/auth.schema";
import { userRole } from "@/shared/communication/permissions/schema/permissions.schema";
import { db } from "@/shared/db/client";
import { SEED_TEST_USERS } from "@/shared/db/seed/seed-config";
import { randomUUID } from "crypto";

export async function seedTestUsers(): Promise<void> {
    try {
        for (const testUser of [...SEED_TEST_USERS]) {
            const userId = randomUUID();

            // Insert user
            await db
                .insert(user)
                .values({
                    id: userId,
                    email: testUser.email,
                    name: testUser.name,
                    role: testUser.roleId,
                    emailVerified: true,
                })
                .onConflictDoNothing();

            // Insert account with password
            await db
                .insert(account)
                .values({
                    id: randomUUID(),
                    userId: userId,
                    accountId: userId,
                    providerId: "credential",
                    password: "e0d6fe7baecccb95d8026055b2799024:33ef504900fe6855a0231484f3e07cc27d205acc651561323c52e7db47098289b1c84f2b87c1bb927931378d471bfcb72c8f95dc8f8ce5a1e402d46d4cb9e78c",
                })
                .onConflictDoNothing();

            // Assign role
            await db
                .insert(userRole)
                .values({
                    id: randomUUID(),
                    userId: userId,
                    roleId: testUser.roleId,
                    contextId: null,
                })
                .onConflictDoNothing();
        }

        console.log(`Seeded ${SEED_TEST_USERS.length} test users`);
    } catch (error) {
        console.error("Failed to seed test users:", error);
        throw error;
    }
}
