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
    userId?: string;
    authorId?: string;
    username?: string;
    text: string;
}): Promise<void> {
    const fromUserId = input.userId || input.authorId;
    if (!fromUserId) return;

    const mentionMatches = input.text.match(/@([a-zA-Z0-9_]+)/g);
    if (!mentionMatches || mentionMatches.length === 0) return;

    const usernames = Array.from(
        new Set(mentionMatches.map((m) => m.slice(1).trim()))
    );

    const matchedUsers = await db
        .select({id: user.id, name: user.name})
        .from(user)
        .where(inArray(user.name, usernames));

    for (const targetUser of matchedUsers) {
        if (targetUser.id === fromUserId) continue;

        if (!(await canInteract(fromUserId, targetUser.id))) continue;

        const mentionId = randomUUID();

        await db.insert(mention).values({
            id: mentionId,
            module: input.module,
            recordId: input.recordId,
            mentionedUserId: targetUser.id,
            mentionedByUserId: fromUserId,
        });

        await notify({
            userId: targetUser.id,
            type: "mention",
            payload: {
                module: input.module,
                recordId: input.recordId,
                fromUserId: fromUserId,
                fromUsername: input.username || "Anonymous",
                url: `/user/${fromUserId}`,
            },
        });
    }
}
