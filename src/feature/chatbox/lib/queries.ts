"use server";

import {user} from "@/core/auth/schema/auth.schema";
import {avatarConfig} from "@/feature/avatar/schema/avatar.schema";
import {db} from "@shared/db/client";
import {and, desc, eq, isNull, lte} from "drizzle-orm";
import {chatboxMessage} from "../schema/chatbox.schema";

/**
 * Fetches paginated chatbox messages ordered chronologically (newest first).
 * Excludes soft-deleted messages.
 */
export async function getChatboxMessages(limit: number = 50, before?: Date) {
    return db
        .select({
            id: chatboxMessage.id,
            userId: chatboxMessage.userId,
            body: chatboxMessage.body,
            createdAt: chatboxMessage.createdAt,
            updatedAt: chatboxMessage.updatedAt,
            deletedAt: chatboxMessage.deletedAt,
            authorName: user.name,
            authorEmail: user.email,
            avatarConfig: avatarConfig.config, // Select avatar configuration JSONB
        })
        .from(chatboxMessage)
        .leftJoin(user, eq(chatboxMessage.userId, user.id))
        .leftJoin(avatarConfig, eq(chatboxMessage.userId, avatarConfig.userId)) // Join avatar_config table
        .where(
            and(
                isNull(chatboxMessage.deletedAt),
                before ? lte(chatboxMessage.createdAt, before) : undefined
            )
        )
        .orderBy(desc(chatboxMessage.createdAt))
        .limit(limit);
}
