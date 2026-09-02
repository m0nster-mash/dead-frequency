"use server";

import {randomUUID} from "crypto";
import {headers} from "next/headers";
import {eq} from "drizzle-orm";
import {auth} from "@/core/auth";
import {db} from "@shared/db/client";
import {forumPost, forumThread} from "../schema/forum.schema";
import {sanitizeContent} from "@shared/communication/sanitize/lib/sanitize";
import {getPostingStatus} from "@shared/communication/status/lib/status";
import {canPost, recordPost} from "@shared/communication/status/lib/trust";
import {logModAction} from "@shared/communication/moderation/lib/audit-log";
import {notify} from "@shared/communication/notifications/lib/notify";
import {canInteract} from "@shared/communication/social/lib/can-interact";

async function requireUser() {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session?.user) throw new Error("Not authenticated");
    return session.user;
}

/** Every module's create-content path follows this same shape:
 *  status check -> trust/rate-limit check -> sanitize -> insert -> side effects. */
export async function createThreadAction(input: { boardId: string; title: string; body: string }) {
    const user = await requireUser();

    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") throw new Error(`Posting not allowed: ${status}`);

    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    const title = sanitizeContent(input.title).clean;
    const body = sanitizeContent(input.body);

    const threadId = randomUUID();
    await db.insert(forumThread).values({
        id: threadId,
        boardId: input.boardId,
        userId: user.id,
        title,
        lastPostAt: new Date(),
    });
    await db.insert(forumPost).values({
        id: randomUUID(),
        threadId,
        userId: user.id,
        body: body.clean,
    });

    await recordPost(user.id);
    // TODO: parse @mentions out of body, insert into `mention` table, notify each mentioned user

    return {threadId};
}

export async function replyToThreadAction(input: { threadId: string; body: string; replyToUserId?: string }) {
    const user = await requireUser();

    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") throw new Error(`Posting not allowed: ${status}`);

    if (input.replyToUserId) {
        const ok = await canInteract(user.id, input.replyToUserId);
        if (!ok) throw new Error("You cannot reply to this user.");
    }

    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    const body = sanitizeContent(input.body);

    await db.insert(forumPost).values({
        id: randomUUID(),
        threadId: input.threadId,
        userId: user.id,
        body: body.clean,
        replyToUserId: input.replyToUserId ?? null,
    });

    await db
        .update(forumThread)
        .set({lastPostAt: new Date()})
        .where(eq(forumThread.id, input.threadId));

    await recordPost(user.id);

    if (input.replyToUserId) {
        await notify({
            userId: input.replyToUserId,
            type: "reply",
            payload: {module: "forum", threadId: input.threadId, fromUserId: user.id},
        });
    }
}

/** Mod-only edit/delete — always routed through logModAction. */
export async function moderatePostAction(input: {
    postId: string;
    action: "edit" | "delete";
    newBody?: string;
    reason?: string;
}) {
    const user = await requireUser();
    if (user.role !== "admin") throw new Error("Forbidden"); // swap for isModerator() once forum-scoped mod roles exist

    if (input.action === "delete") {
        await db.update(forumPost).set({deletedAt: new Date()}).where(eq(forumPost.id, input.postId));
    } else if (input.newBody) {
        const body = sanitizeContent(input.newBody);
        await db.update(forumPost).set({body: body.clean}).where(eq(forumPost.id, input.postId));
    }

    await logModAction({
        module: "forum",
        recordId: input.postId,
        action: input.action,
        moderatorId: user.id,
        reason: input.reason ?? null,
    });
}
