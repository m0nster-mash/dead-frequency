"use server";

import {randomUUID} from "crypto";
import {headers} from "next/headers";
import {eq, sql} from "drizzle-orm";
import {auth} from "@/core/auth";
import {db} from "@shared/db/client";
import {forumPost, forumThread} from "@/feature/forum/schema/forum.schema";
import {sanitizeContent} from "@shared/communication/sanitize/lib/sanitize";
import {getPostingStatus} from "@shared/communication/status/lib/status";
import {canPost, recordPost} from "@shared/communication/status/lib/trust";
import {notify} from "@shared/communication/notifications/lib/notify";
import {canInteract} from "@shared/communication/social/lib/can-interact";
import {revalidatePath} from "next/cache";

async function requireUser() {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user) throw new Error("Not authenticated");
    return session.user;
}

export async function createThreadAction(input: { boardId: string; title: string; body: string }) {
    const user = await requireUser();

    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    const cleanTitle = sanitizeContent(input.title).clean.trim();
    const cleanBody = sanitizeContent(input.body).clean.trim();

    if (!cleanTitle) throw new Error("Thread title is required.");
    if (!cleanBody) throw new Error("Post body is required.");

    const threadId = randomUUID();
    const now = new Date();

    await db.insert(forumThread).values({
        id: threadId,
        boardId: input.boardId,
        userId: user.id,
        title: cleanTitle,
        postCount: 1,
        lastPostAt: now,
        createdAt: now,
    });

    await db.insert(forumPost).values({
        id: randomUUID(),
        threadId,
        userId: user.id,
        body: cleanBody,
        createdAt: now,
        updatedAt: now,
    });

    await recordPost(user.id);

    revalidatePath("/forum");
    return {threadId};
}

export async function replyToThreadAction(input: {
    threadId: string;
    body: string;
    replyToUserId?: string;
}) {
    const user = await requireUser();

    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    if (input.replyToUserId) {
        const ok = await canInteract(user.id, input.replyToUserId);
        if (!ok) throw new Error("You cannot reply to this user.");
    }

    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) throw new Error("Post body is required.");

    const now = new Date();

    await db.insert(forumPost).values({
        id: randomUUID(),
        threadId: input.threadId,
        userId: user.id,
        body: cleanBody,
        replyToUserId: input.replyToUserId ?? null,
        createdAt: now,
        updatedAt: now,
    });

    await db
        .update(forumThread)
        .set({
            postCount: sql`${forumThread.postCount}
            + 1`,
            lastPostAt: now,
        })
        .where(eq(forumThread.id, input.threadId));

    await recordPost(user.id);

    if (input.replyToUserId) {
        await notify({
            userId: input.replyToUserId,
            type: "reply",
            payload: {module: "forum", threadId: input.threadId, fromUserId: user.id},
        });
    }

    revalidatePath("/forum");
}
