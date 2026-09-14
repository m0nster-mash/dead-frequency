import { db } from "@/shared/db/client";
import {
    user,
    account,
    userRole,
    userProfile,
    userStats,
} from "@/core/auth/schema/auth.schema";
import {randomUUID} from "node:crypto";

/**
 * Initial development seed users representing each system tier.
 */
const INITIAL_USERS = [
    {
        id: randomUUID(),
        name: "System Admin",
        email: "admin@test.com",
        roleId: "admin",
        bio: "System Administrator for Dead Frequency",
    },
    {
        id: randomUUID(),
        name: "Community Moderator",
        email: "moderator@test.com",
        roleId: "moderator",
        bio: "Content and Community Moderator",
    },
    {
        id: randomUUID(),
        name: "Standard User",
        email: "user@test.com",
        roleId: "user",
        bio: "Registered Community Member",
    },
];

/**
 * Seeds initial users, credential account records, RBAC roles, profiles, and stats.
 */
export async function seedUsers(): Promise<void> {
    console.log("Seeding initial users...");

    for (const u of INITIAL_USERS) {
        // 1. Core BetterAuth User Record
        await db
            .insert(user)
            .values({
                id: u.id,
                name: u.name,
                email: u.email,
                emailVerified: true,
            })
            .onConflictDoNothing();

        // 2. Credentials Account Entry (BetterAuth Native)
        await db
            .insert(account)
            .values({
                id: `acc_${u.id}`,
                userId: u.id,
                accountId: u.email,
                providerId: "credential",
                // Pre-hashed credential placeholder string for development
                password: "$2a$10$e8W/X2zO.01nO/5m8h1c.Oq3YV6w8P8P8P8P8P8P8P8P8P8P8P8P8",
            })
            .onConflictDoNothing();

        // 3. Assign Role in Junction Table
        await db
            .insert(userRole)
            .values({
                userId: u.id,
                roleId: u.roleId,
            })
            .onConflictDoNothing();

        // 4. Initialize User Profile
        await db
            .insert(userProfile)
            .values({
                id: `prof_${u.id}`,
                userId: u.id,
                bio: u.bio,
            })
            .onConflictDoNothing();

        // 5. Initialize Post Activity & Trust Counters
        await db
            .insert(userStats)
            .values({
                userId: u.id,
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
