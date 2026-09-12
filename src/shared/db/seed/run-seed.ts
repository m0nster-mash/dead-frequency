import {seedRoles} from "@/shared/db/seed/seed-roles";

/**
 * Seed runner entrypoint.
 * Usage (example): tsx src/shared/db/seed/run-seed.ts
 */
async function main(): Promise<void> {
    console.log("Starting DB seed...");
    await seedRoles();
    console.log("Role seed complete.");
}

main().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
