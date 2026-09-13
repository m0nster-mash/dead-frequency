"use server";

import {auth} from "@/core/auth";
import {processMentions} from "@/shared/communication/mentions/lib/mentions";
import {logModAction} from "@/shared/communication/moderation/lib/audit-log";
import {sanitizeContent} from "@/shared/communication/sanitize/lib/sanitize";
import {getPostingStatus} from "@/shared/communication/status/lib/status";
import {canPost, recordPost} from "@/shared/communication/status/lib/trust";
import {db} from "@/shared/db/client";
import {randomUUID} from "crypto";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";
import {chatboxMessage} from "../schema/chatbox.schema";

async function getAuthenticatedUser() {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({headers: reqHeaders}) : null;

    if (!session?.user) {
        throw new Error(
            "Unauthorized: You must be logged in to perform this action."
        );
    }
    return session.user;
}

export async function createChatboxMessageAction(input: {
    body: string;
}): Promise<{ messageId: string }> {
    const user = await getAuthenticatedUser();

    const status = await getPostingStatus(user.id, "chatbox");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    const trust = await canPost(user.id);
    if (!trust.allowed) {
        throw new Error(trust.reason);
    }

    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) {
        throw new Error("Message body is required.");
    }

    const messageId = randomUUID();
    const now = new Date();

    await db.insert(chatboxMessage).values({
        id: messageId,
        userId: user.id,
        body: cleanBody,
        createdAt: now,
        updatedAt: now,
    });

    await recordPost(user.id);

    await processMentions({
        module: "chatbox",
        recordId: messageId,
        userId: user.id,
        username: user.name || user.email || "Anonymous",
        text: cleanBody,
    });

    revalidatePath("/", "layout");
    return {messageId};
}

export async function deleteChatboxMessageAction(input: {
    messageId: string;
    reason?: string;
}): Promise<void> {
    const admin = await getAuthenticatedUser();

    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) {
        throw new Error("Message not found.");
    }

    const now = new Date();

    await db
        .update(chatboxMessage)
        .set({deletedAt: now})
        .where(eq(chatboxMessage.id, input.messageId));

    await logModAction({
        module: "chatbox",
        recordId: input.messageId,
        action: "delete",
        moderatorId: admin.id,
        targetUserId: message.userId,
        reason: input.reason ?? "Deleted by admin",
    });

    revalidatePath("/", "layout");
}

export async function restoreChatboxMessageAction(input: {
    messageId: string;
    reason?: string;
}): Promise<void> {
    const admin = await getAuthenticatedUser();

    const [message] = await db
        .select()
        .from(chatboxMessage)
        .where(eq(chatboxMessage.id, input.messageId))
        .limit(1);

    if (!message) {
        throw new Error("Message not found.");
    }

    await db
        .update(chatboxMessage)
        .set({deletedAt: null})
        .where(eq(chatboxMessage.id, input.messageId));

    await logModAction({
        module: "chatbox",
        recordId: input.messageId,
        action: "restore",
        moderatorId: admin.id,
        targetUserId: message.userId,
        reason: input.reason ?? "Restored by admin",
    });

    revalidatePath("/", "layout");
}
