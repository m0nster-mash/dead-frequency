import {user} from "@/core/auth/schema/auth.schema";
import {chatboxConversation, chatboxMessage} from "@/feature/chatbox/schema/chatbox.schema";
import {db} from "@shared/db/client";
import {asc, desc, eq, isNull} from "drizzle-orm";

/**
 * Fetches all conversations visible to the application, optionally filtered by context.
 * Conversations are sorted by most recent activity (lastMessageAt) to float active discussions to the top.
 *
 * @param {string} [contextId] - Optional context identifier to scope conversations to a guild or specific domain.
 *                               If omitted, returns site-wide conversations.
 *
 * @returns {Promise<Array>} An array of conversation summaries with creator information and metadata.
 */
export async function listConversations(contextId?: string) {
    const conversations = await db
        .select({
            id: chatboxConversation.id,
            contextId: chatboxConversation.contextId,
            title: chatboxConversation.title,
            description: chatboxConversation.description,
            messageCount: chatboxConversation.messageCount,
            lastMessageAt: chatboxConversation.lastMessageAt,
            createdAt: chatboxConversation.createdAt,
            createdByUserId: chatboxConversation.createdByUserId,
            createdByUserName: user.name,
            createdByUserEmail: user.email,
        })
        .from(chatboxConversation)
        .leftJoin(user, eq(chatboxConversation.createdByUserId, user.id))
        .where(
            contextId
                ? eq(chatboxConversation.contextId, contextId)
                : isNull(chatboxConversation.contextId)
        )
        .orderBy(desc(chatboxConversation.lastMessageAt));

    return conversations;
}

/**
 * Retrieves a single conversation by ID along with its creator details.
 *
 * @param {string} conversationId - The unique identifier of the conversation to fetch.
 *
 * @returns {Promise<object | null>} A conversation object with creator metadata, or null if not found.
 */
export async function getConversation(conversationId: string) {
    const [conversation] = await db
        .select({
            id: chatboxConversation.id,
            contextId: chatboxConversation.contextId,
            title: chatboxConversation.title,
            description: chatboxConversation.description,
            messageCount: chatboxConversation.messageCount,
            lastMessageAt: chatboxConversation.lastMessageAt,
            createdAt: chatboxConversation.createdAt,
            createdByUserId: chatboxConversation.createdByUserId,
            createdByUserName: user.name,
            createdByUserEmail: user.email,
        })
        .from(chatboxConversation)
        .leftJoin(user, eq(chatboxConversation.createdByUserId, user.id))
        .where(eq(chatboxConversation.id, conversationId))
        .limit(1);

    return conversation ?? null;
}

/**
 * Fetches all messages belonging to a specific conversation, sorted chronologically.
 * Includes author information via a left join to preserve messages from deleted users.
 *
 * @param {string} conversationId - The unique identifier of the target conversation.
 *
 * @returns {Promise<Array>} An array of message objects with author details, ordered by creation time.
 */
export async function getConversationMessages(conversationId: string) {
    const messages = await db
        .select({
            id: chatboxMessage.id,
            conversationId: chatboxMessage.conversationId,
            userId: chatboxMessage.userId,
            characterId: chatboxMessage.characterId,
            body: chatboxMessage.body,
            createdAt: chatboxMessage.createdAt,
            updatedAt: chatboxMessage.updatedAt,
            deletedAt: chatboxMessage.deletedAt,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(chatboxMessage)
        .leftJoin(user, eq(chatboxMessage.userId, user.id))
        .where(eq(chatboxMessage.conversationId, conversationId))
        .orderBy(asc(chatboxMessage.createdAt));

    return messages;
}

/**
 * Retrieves a single message by ID with author information.
 *
 * @param {string} messageId - The unique identifier of the message to fetch.
 *
 * @returns {Promise<object | null>} A message object with author details, or null if not found.
 */
export async function getMessage(messageId: string) {
    const [message] = await db
        .select({
            id: chatboxMessage.id,
            conversationId: chatboxMessage.conversationId,
            userId: chatboxMessage.userId,
            characterId: chatboxMessage.characterId,
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

    return message ?? null;
}
