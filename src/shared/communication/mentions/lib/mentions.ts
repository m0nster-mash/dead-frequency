"use server";

import {user} from "@/core/auth/schema/auth.schema";
import {mention} from "@/shared/communication/mentions/schema/mentions.schema";
import {moduleEnum} from "@/shared/communication/moderation/schema/moderation.schema";
import {notify} from "@/shared/communication/notifications/lib/notify";
import {canInteract} from "@/shared/communication/social/lib/can-interact";
import {db} from "@/shared/db/client";
import {randomUUID} from "crypto";
import {inArray} from "drizzle-orm";

type TargetModule = (typeof moduleEnum.enumValues)[number];

export async function processMentions(input: {
    module: TargetModule;
    recordId: string;
    authorId: string;
    text: string;
}): Promise<void> {
    // Regex to extract @username handles (alphanumeric + underscores)
    const mentionMatches = input.text.match(/@([a-zA-Z0-9_]+)/g);
    if (!mentionMatches || mentionMatches.length === 0) return;

    const usernames = Array.from(
        new Set(mentionMatches.map((m) => m.slice(1).trim()))
    );

    // Look up matching users by name
    const matchedUsers = await db
        .select({id: user.id, name: user.name})
        .from(user)
        .where(inArray(user.name, usernames));

    for (const targetUser of matchedUsers) {
        if (targetUser.id === input.authorId) continue; // Skip self-mentions

        // Enforce interpersonal block restrictions
        if (!(await canInteract(input.authorId, targetUser.id))) continue;

        const mentionId = randomUUID();

        // Insert into attachable mention table
        await db.insert(mention).values({
            id: mentionId,
            module: input.module,
            recordId: input.recordId,
            mentionedUserId: targetUser.id,
            mentionedByUserId: input.authorId,
        });

        // Push notification to recipient
        await notify({
            userId: targetUser.id,
            type: "mention",
            payload: {
                module: input.module,
                recordId: input.recordId,
                mentionedByUserId: input.authorId,
            },
        });
    }
}
