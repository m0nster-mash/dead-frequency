"use server";

import {user} from "@/core/auth/schema/auth.schema";
import {db} from "@shared/db/client";
import {and, desc, eq, isNull, lte} from "drizzle-orm";
import {chatboxMessage} from "../schema/chatbox.schema";

/**
 * Fetches paginated chatbox messages ordered chronologically (newest first).
 * Excludes soft-deleted messages.
 *
 * @param {number} [limit=50] - Maximum number of messages to retrieve
 * @param {Date} [before] - Optional cursor for pagination; fetch messages before this timestamp
 *
 * @returns {Promise<Array>} Array of messages with author details
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
        })
        .from(chatboxMessage)
        .leftJoin(user, eq(chatboxMessage.userId, user.id))
        .where(
            and(
                // Exclude soft-deleted messages
                isNull(chatboxMessage.deletedAt),
                // Pagination cursor: fetch messages older than the provided timestamp
                before ? lte(chatboxMessage.createdAt, before) : undefined,
            )
        )
        // Newest messages first
        .orderBy(desc(chatboxMessage.createdAt))
        .limit(limit);
}

/**
 * Fetches a single chatbox message by ID for validation or display purposes.
 *
 * @param {string} messageId - The unique identifier of the message
 *
 * @returns {Promise<Object | null>} Message with author details or null if not found
 */
export async function getChatboxMessageById(messageId: string) {
    const [message] = await db
        .select({
            id: chatboxMessage.id,
            userId: chatboxMessage.userId,
            body: chatboxMessage.body,
            createdAt: chatboxMessage.createdAt,
            updatedAt: chatboxMessage.updatedAt,
            deletedAt: chatboxMessage.deletedAt,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(chatboxMessage)
        .leftJoin(user, eq(chatboxMessage.userId, user.id))
        .where(eq(chatboxMessage.id, messageId))
        .limit(1);

    return message || null;
}
