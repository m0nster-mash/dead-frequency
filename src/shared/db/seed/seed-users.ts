import {account, user, userProfile, userRole, userStats,} from "@/core/auth/schema/auth.schema";
import {db} from "@/shared/db/client";
import {SEED_TEST_USERS} from "@shared/db/seed/seed-config";
import {randomUUID} from "node:crypto";

/**
 * Seeds initial users, credential account records, RBAC roles, profiles, and stats.
 */
export async function seedUsers(): Promise<void> {
    console.log("Seeding initial users...");

    for (const seedTestUser of SEED_TEST_USERS) {
        const uuid = randomUUID();

        await db
            .insert(user)
            .values({
                id: uuid,
                name: seedTestUser.name,
                email: seedTestUser.email,
                emailVerified: true,
            })
            .onConflictDoUpdate({
                target: user.email,
                set: {
                    name: seedTestUser.name,
                    emailVerified: true,
                }
            });

        // 2. Credentials Account Entry (BetterAuth Native)
        await db
            .insert(account)
            .values({
                id: `acc_${uuid}`,
                userId: uuid,
                accountId: uuid,
                providerId: "credential",
                password: "e0d6fe7baecccb95d8026055b2799024:33ef504900fe6855a0231484f3e07cc27d205acc651561323c52e7db47098289b1c84f2b87c1bb927931378d471bfcb72c8f95dc8f8ce5a1e402d46d4cb9e78c",
            })
            .onConflictDoNothing();

        // 3. Assign Role in Junction Table
        await db
            .insert(userRole)
            .values({
                userId: uuid,
                roleId: seedTestUser.roleId,
            })
            .onConflictDoNothing();

        // 4. Initialize User Profile
        await db
            .insert(userProfile)
            .values({
                id: `prof_${uuid}`,
                userId: uuid,
                bio: seedTestUser.bio,
            })
            .onConflictDoNothing();

        // 5. Initialize Post Activity & Trust Counters
        await db
            .insert(userStats)
            .values({
                userId: uuid,
                forumPostCount: 0,
                chatMessageCount: 0,
                chatboxMessageCount: 0,
                commentCount: 0,
                trustScore: 100,
            })
            .onConflictDoNothing();
    }

    console.log("Initial users, roles, profiles, and stats seeded successfully.");
}
