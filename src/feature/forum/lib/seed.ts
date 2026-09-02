import {randomUUID} from "crypto";
import {db} from "@shared/db/client";
import {forumBoard, forumCategory} from "../schema/forum.schema";

/**
 * One-time seed for the initial category/board hierarchy. Safe to re-run —
 * skips insert if categories already exist. Run manually (e.g. via a
 * scratch script or ts-node) rather than on every app boot.
 */
export async function seedForumHierarchy() {
    const existing = await db.select().from(forumCategory).limit(1);
    if (existing.length > 0) {
        console.log("[forum/seed] Categories already exist, skipping seed.");
        return;
    }

    const generalId = randomUUID();
    const communityId = randomUUID();

    await db.insert(forumCategory).values([
        {id: generalId, label: "General", sortOrder: 0},
        {id: communityId, label: "Community", sortOrder: 1},
    ]);

    await db.insert(forumBoard).values([
        {
            id: randomUUID(),
            categoryId: generalId,
            label: "Announcements",
            description: "Site news and updates from the team.",
            sortOrder: 0,
        },
        {
            id: randomUUID(),
            categoryId: generalId,
            label: "General Discussion",
            description: "Talk about anything and everything.",
            sortOrder: 1,
        },
        {
            id: randomUUID(),
            categoryId: communityId,
            label: "Introductions",
            description: "New here? Say hello.",
            sortOrder: 0,
        },
        {
            id: randomUUID(),
            categoryId: communityId,
            label: "Feedback & Suggestions",
            description: "Ideas and feedback for the site.",
            sortOrder: 1,
        },
    ]);

    console.log("[forum/seed] Seeded 2 categories and 4 boards.");
}
