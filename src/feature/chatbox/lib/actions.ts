"use server";

import { auth } from "@/core/auth";
import { requireUser } from "@/core/auth/lib/require-user";
import { sanitizeContent } from "@/shared/communication/sanitize/lib/sanitize";
import { getPostingStatus } from "@/shared/communication/status/lib/status";
import { canPost, recordPost } from "@/shared/communication/status/lib/trust";
import { db } from "@/shared/db/client";
import { logModAction } from "@shared/communication/moderation/lib/audit-log";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { chatboxMessage } from "../schema/chatbox.schema";

/**
 * Helper to retrieve the current authenticated user session and resolve user details.
 */
async function getAuthenticatedUser(context: string) {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user) {
        throw new Error("Unauthorized: You must be logged in to perform this action.");
    }

    return requireUser(session.user.id, {
        headers: reqHeaders,
        context,
    });
}

/**
 * Server action to create a new chatbox message.
 */
export async function createChatboxMessageAction(
    input: { body: string }
): Promise<{ messageId: string }> {
    const user = await getAuthenticatedUser("createChatboxMessageAction");

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
    await db.insert(chatboxMessage).values({
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

    return { messageId };
}

/**
 * Admin action to delete a chatbox message (soft delete).
 */
export async function deleteChatboxMessageAction(
    input: { messageId: string; reason?: string }
): Promise<void> {
    const admin = await getAuthenticatedUser("deleteChatboxMessageAction");

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
        .set({ deletedAt: now })
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

    revalidatePath("/", "layout");
}

/**
 * Admin action to edit a chatbox message.
 */
export async function editChatboxMessageAction(
    input: { messageId: string; body: string; reason?: string }
): Promise<void> {
    const admin = await getAuthenticatedUser("editChatboxMessageAction");

    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) {
        throw new Error("Message body is required.");
    }

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
        .set({ body: cleanBody, updatedAt: now })
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

    revalidatePath("/", "layout");
}
