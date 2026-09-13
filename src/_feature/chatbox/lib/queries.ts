"use server";

import {user} from "@/core/auth/schema/auth.schema";
import {avatarConfig} from "@/feature/avatar/schema/avatar.schema";
import {reaction} from "@/shared/communication/interactions/schema/interactions.schema";
import {db} from "@/shared/db/client";
import {and, desc, eq, inArray, isNull, lte} from "drizzle-orm";
import {chatboxMessage} from "../schema/chatbox.schema";

export async function getChatboxMessages(
    limit: number = 50,
    before?: Date,
    includeDeleted: boolean = false,
    currentUserId?: string
) {
    const messages = await db
        .select({
            id: chatboxMessage.id,
            userId: chatboxMessage.userId,
            body: chatboxMessage.body,
            createdAt: chatboxMessage.createdAt,
            updatedAt: chatboxMessage.updatedAt,
            deletedAt: chatboxMessage.deletedAt,
            username: user.name,
            authorEmail: user.email,
            avatarConfig: avatarConfig.config,
        })
        .from(chatboxMessage)
        .leftJoin(user, eq(chatboxMessage.userId, user.id))
        .leftJoin(avatarConfig, eq(chatboxMessage.userId, avatarConfig.userId))
        .where(
            and(
                includeDeleted ? undefined : isNull(chatboxMessage.deletedAt),
                before ? lte(chatboxMessage.createdAt, before) : undefined
            )
        )
        .orderBy(desc(chatboxMessage.createdAt))
        .limit(limit);

    const messageIds = messages.map((m) => m.id);

    let reactions: (typeof reaction.$inferSelect)[] = [];
    if (messageIds.length > 0) {
        reactions = await db
            .select()
            .from(reaction)
            .where(
                and(
                    eq(reaction.module, "chatbox"),
                    inArray(reaction.recordId, messageIds)
                )
            );
    }

    return messages.map((msg) => {
        const msgReactions = reactions.filter((r) => r.recordId === msg.id);
        const hasLiked = currentUserId
            ? msgReactions.some((r) => r.userId === currentUserId)
            : false;

        return {
            ...msg,
            likeCount: msgReactions.length,
            hasLiked,
        };
    });
}
