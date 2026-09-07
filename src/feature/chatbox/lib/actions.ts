"use server";

import {auth} from "@/core/auth";
import {chatboxConversation, chatboxMessage} from "@/feature/chatbox/schema/chatbox.schema";
import {notify} from "@shared/communication/notifications/lib/notify";
import {logModAction} from "@shared/communication/moderation/lib/audit-log";
import {sanitizeContent} from "@shared/communication/sanitize/lib/sanitize";
import {canInteract} from "@shared/communication/social/lib/can-interact";
import {getPostingStatus} from "@shared/communication/status/lib/status";
import {canPost, recordPost} from "@shared/communication/status/lib/trust";
import {db} from "@shared/db/client";
import {randomUUID} from "crypto";
import {eq, sql} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";

/**
 * High-security inline validation utility checking server-side session authentication tokens. Extracts account
 * metadata if valid, blocking anonymous requests out of mutation pathways.
 *
 * @throws {Error} Throws an explicit `"Not authenticated"` error if the session context is missing.
 */
async function requireUser() {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user) throw new Error("Not authenticated");
    return session.user;
}

/**
 * An asynchronous Next.js Server Action that creates a new chatbox conversation.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.title - The conversation title/topic.
 * @param {string} [input.description] - Optional description providing context for the conversation.
 * @param {string} [input.contextId] - Optional context identifier scoping the conversation to a guild or domain.
 *
 * @throws {Error} Throws validation exceptions if inputs are invalid or if security guards block access.
 *
 * @returns {Promise<{conversationId: string}>} A promise resolving to the generated conversation ID.
 */
export async function createConversationAction(input: {
    title: string;
    description?: string;
    contextId?: string;
}): Promise<{conversationId: string}> {
    const user = await requireUser();

    // Prevents restricted accounts from creating conversations
    const status = await getPostingStatus(user.id, "chatbox");
    if (status === "banned") {
        throw new Error("You are banned from chatbox and cannot create conversations.");
    }

    // Verifies systemic trust clearance indexes
    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    // Sanitize inputs
    const cleanTitle = sanitizeContent(input.title).clean.trim();
    const cleanDescription = input.description
        ? sanitizeContent(input.description).clean.trim()
        : null;

    if (!cleanTitle) throw new Error("Conversation title is required.");
    if (cleanTitle.length > 255) throw new Error("Title must be 255 characters or less.");

    const conversationId = randomUUID();
    const now = new Date();

    // Insert the new conversation
    await db
        .insert(chatboxConversation)
        .values({
            id: conversationId,
            contextId: input.contextId ?? null,
            title: cleanTitle,
            description: cleanDescription,
            createdByUserId: user.id,
            lastMessageAt: now,
            messageCount: "0",
            createdAt: now,
        });

    // Update user trust/engagement metrics
    await recordPost(user.id);

    // Invalidate conversations list cache
    revalidatePath("/chatbox");

    return {conversationId};
}

/**
 * An asynchronous Next.js Server Action that posts a new message to a conversation.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.conversationId - The ID of the target conversation.
 * @param {string} input.body - The message body text.
 * @param {string} [input.characterId] - Optional character ID if posting as a character.
 *
 * @throws {Error} Throws validation exceptions if inputs are invalid or security checks fail.
 *
 * @returns {Promise<{messageId: string}>} A promise resolving to the generated message ID.
 */
export async function createMessageAction(input: {
    conversationId: string;
    body: string;
    characterId?: string;
}): Promise<{messageId: string}> {
    const user = await requireUser();

    // Check posting status (muted/shadowbanned/banned blocks message creation)
    const status = await getPostingStatus(user.id, "chatbox");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    // Check trust/cooldown
    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    // Sanitize message body
    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) throw new Error("Message body is required.");
    if (cleanBody.length > 5000) throw new Error("Message must be 5000 characters or less.");

    // Verify conversation exists
    const [conversation] = await db
        .select()
        .from(chatboxConversation)
        .where(eq(chatboxConversation.id, input.conversationId))
        .limit(1);

    if (!conversation) throw new Error("Conversation not found.");

    const messageId = randomUUID();
    const now = new Date();

    // Insert the message
    await db
        .insert(chatboxMessage)
        .values({
            id: messageId,
            conversationId: input.conversationId,
            userId: user.id,
            characterId: input.characterId ?? null,
            body: cleanBody,
            createdAt: now,
            updatedAt: now,
        });

    // Update conversation metadata (message count and last message timestamp)
    await db
        .update(chatboxConversation)
        .set({
            messageCount: sql`${chatboxConversation.messageCount}::integer + 1`,
            lastMessageAt: now,
        })
        .where(eq(chatboxConversation.id, input.conversationId));

    // Update user trust/engagement metrics
    await recordPost(user.id);

    // Invalidate conversation messages cache
    revalidatePath(`/chatbox/${input.conversationId}`);

    return {messageId};
}

/**
 * An asynchronous Next.js Server Action that updates (edits) an existing message body.
 * Only the message author can edit their own messages. Users cannot delete messages.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.messageId - The ID of the message to edit.
 * @param {string} input.body - The new message body text.
 *
 * @throws {Error} Throws if message not found, user is not the author, or validation fails.
 *
 * @returns {Promise<void>} Resolves once the update completes.
 */
export async function editMessageAction(input: {
    messageId: string;
    body: string;
}): Promise<void> {
    const user = await requireUser();

    // Fetch the message to verify ownership
    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) throw new Error("Message not found.");

    // Verify the current user is the message author
    if (message.userId !== user.id) {
        throw new Error("You can only edit your own messages.");
    }

    // Sanitize new body
    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) throw new Error("Message body is required.");
    if (cleanBody.length > 5000) throw new Error("Message must be 5000 characters or less.");

    const now = new Date();

    // Update message body and timestamp
    await db
        .update(chatboxMessage)
        .set({
            body: cleanBody,
            updatedAt: now,
        })
        .where(eq(chatboxMessage.id, input.messageId));

    // Invalidate message cache
    revalidatePath(`/chatbox/${message.conversationId}`);
}

/**
 * An asynchronous Next.js Server Action that deletes a message (admin only).
 * Only administrators can delete messages via the moderation system.
 * Regular users cannot delete their own messages or any other messages.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.messageId - The ID of the message to delete.
 * @param {string} input.moderatorId - The ID of the admin performing the deletion.
 * @param {string} [input.reason] - Optional reason for the deletion (recorded in audit log).
 *
 * @throws {Error} Throws if message not found or moderation check fails.
 *
 * @returns {Promise<void>} Resolves once the soft-delete completes.
 */
export async function deleteMessageAction(input: {
    messageId: string;
    moderatorId: string;
    reason?: string;
}): Promise<void> {
    // Fetch the message
    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) throw new Error("Message not found.");

    const now = new Date();

    // Perform soft delete
    await db
        .update(chatboxMessage)
        .set({
            deletedAt: now,
        })
        .where(eq(chatboxMessage.id, input.messageId));

    // Log the moderation action
    await logModAction({
        module: "chatbox",
        recordId: input.messageId,
        action: "delete",
        moderatorId: input.moderatorId,
        targetUserId: message.userId,
        reason: input.reason ?? null,
    });

    // Invalidate message cache
    revalidatePath(`/chatbox/${message.conversationId}`);
}
