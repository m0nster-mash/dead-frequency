"use server";

import {requireUser} from "@/core/auth/lib/require-user";
import {sanitizeContent} from "@/shared/communication/sanitize/lib/sanitize";
import {getPostingStatus} from "@/shared/communication/status/lib/status";
import {canPost, recordPost} from "@/shared/communication/status/lib/trust";
import {db} from "@/shared/db/client";
import {logModAction} from "@shared/communication/moderation/lib/audit-log";
import {randomUUID} from "crypto";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {chatboxMessage} from "../schema/chatbox.schema";

/**
 * Server action to create a new chatbox message.
 * Validates user posting status, sanitizes content, and logs the action.
 *
 * @param {Object} input - Message creation parameters
 * @param {string} input.body - Raw message text from user
 *
 * @throws {Error} If user is banned/muted, content is empty, or validation fails
 *
 * @returns {Promise<{ messageId: string }>} New message ID on success
 */
export async function createChatboxMessageAction(
    input: { body: string }
): Promise<{ messageId: string }> {
    const user = await requireUser();

    // System-level posting status check
    const status = await getPostingStatus(user.id, "chatbox");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    // Trust level and cooldown validation
    const trust = await canPost(user.id);
    if (!trust.allowed) {
        throw new Error(trust.reason);
    }

    // Content sanitization
    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) {
        throw new Error("Message body is required.");
    }

    const messageId = randomUUID();
    const now = new Date();

    // Database insertion
    await db
        .insert(chatboxMessage)
        .values({
            id: messageId,
            userId: user.id,
            body: cleanBody,
            createdAt: now,
            updatedAt: now,
        });

    // Track user activity for reputation/engagement metrics
    await recordPost(user.id);

    // Revalidate chatbox routes to refresh UI
    revalidatePath("/", "layout");

    return {messageId};
}

/**
 * Admin action to delete a chatbox message (soft delete).
 * Logs the moderation action for audit trail.
 *
 * @param {Object} input - Deletion parameters
 * @param {string} input.messageId - ID of message to delete
 * @param {string} [input.reason] - Optional moderation reason
 *
 * @throws {Error} If user is not admin or message not found
 *
 * @returns {Promise<void>}
 */
export async function deleteChatboxMessageAction(
    input: { messageId: string; reason?: string }
): Promise<void> {
    const admin = await requireUser();

    // Verify admin permissions (requireUser with admin check would be needed from auth lib)
    // TODO: Add admin role verification when auth patterns are established

    // Fetch the message to get the target user
    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) {
        throw new Error("Message not found.");
    }

    const now = new Date();

    // Soft delete the message
    await db
        .update(chatboxMessage)
        .set({deletedAt: now})
        .where(eq(chatboxMessage.id, input.messageId));

    // Log the moderation action
    await logModAction({
        module: "chatbox",
        recordId: input.messageId,
        action: "delete",
        moderatorId: admin.id,
        targetUserId: message.userId,
        reason: input.reason,
    });

    // Revalidate chatbox routes
    revalidatePath("/", "layout");
}

/**
 * Admin action to edit a chatbox message.
 * Updates the body and updatedAt timestamp, logs moderation action.
 *
 * @param {Object} input - Edit parameters
 * @param {string} input.messageId - ID of message to edit
 * @param {string} input.body - New message body
 * @param {string} [input.reason] - Optional moderation reason
 *
 * @throws {Error} If user is not admin, message not found, or content invalid
 *
 * @returns {Promise<void>}
 */
export async function editChatboxMessageAction(
    input: { messageId: string; body: string; reason?: string }
): Promise<void> {
    const admin = await requireUser();

    // TODO: Add admin role verification

    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) {
        throw new Error("Message body is required.");
    }

    // Fetch the message to validate it exists
    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) {
        throw new Error("Message not found.");
    }

    const now = new Date();

    // Update the message
    await db
        .update(chatboxMessage)
        .set({body: cleanBody, updatedAt: now})
        .where(eq(chatboxMessage.id, input.messageId));

    // Log the moderation action
    await logModAction({
        module: "chatbox",
        recordId: input.messageId,
        action: "edit",
        moderatorId: admin.id,
        targetUserId: message.userId,
        reason: input.reason,
    });

    // Revalidate chatbox routes
    revalidatePath("/", "layout");
}
