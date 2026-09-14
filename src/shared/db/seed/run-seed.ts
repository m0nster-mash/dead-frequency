import "dotenv/config";
import {seedRoles} from "@/shared/db/seed/seed-roles";
import {seedUsers} from "@shared/db/seed/seed-users";

/**
 * Seed runner entrypoint with connection validation
 * Usage: npx tsx src/shared/db/seed/run-seed.ts
 */
async function main(): Promise<void> {
    console.log("Starting DB seed...");
    console.log("Checking DATABASE_URL...");

    // Validate connection string before running seeds
    if (!process.env.DATABASE_URL) {
        throw new Error(
            "DATABASE_URL environment variable is not set. " +
            "Please check your .env file or environment configuration."
        );
    }

    try {
        // Run seeds in order
        await seedRoles();
        await seedUsers();

        console.log("✓ All seeds completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

main();
