import { db } from "@/shared/db/client";
import { role } from "@/core/auth/schema/auth.schema";

export async function seedRoles() {
    const roles = [
        {
            id: "admin",
            name: "Administrator",
            description: "Full administrative access across all modules",
            bypassesCooldown: true,
        },
        {
            id: "moderator",
            name: "Moderator",
            description: "Content moderation, audit log access, and user sanction rights",
            bypassesCooldown: true,
        },
        {
            id: "user",
            name: "User",
            description: "Standard registered user account with posting capabilities",
            bypassesCooldown: false,
        },
    ];

    for (const r of roles) {
        await db.insert(role).values(r).onConflictDoNothing();
    }
    console.log("System roles seeded successfully.");
}
