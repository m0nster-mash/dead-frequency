"use server";

import {auth} from "@/core/auth";
import {forumPost, forumThread} from "@/feature/forum/schema/forum.schema";
import {notify} from "@/shared/communication/notifications/lib/notify";
import {sanitizeContent} from "@/shared/communication/sanitize/lib/sanitize";
import {canInteract} from "@/shared/communication/social/lib/can-interact";
import {getPostingStatus} from "@/shared/communication/status/lib/status";
import {canPost, recordPost} from "@/shared/communication/status/lib/trust";
import {db} from "@/shared/db/client";
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
 * An asynchronous Next.js Server Action that instantiates a new discussion topic thread along with its initial root
 * content post record.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.boardId - Unique identifier of the target discussion board hosting the topic.
 * @param {string} input.title - Raw topic headline submitted by the user.
 * @param {string} input.body - Raw contextual body text forming the initial post text wrapper.
 *
 * @throws {Error} Throws validation exceptions if inputs resolve as empty strings or if security guards block access.
 *
 * @returns {Promise<{threadId: string}>} A promise resolving to an operational payload containing the generated
 *                                        thread identity key.
 */
export async function createThreadAction(input: {
    boardId: string;
    title: string;
    body: string
}): Promise<{ threadId: string; }> {
    const user = await requireUser();

    // prevents restricted accounts from inserting system rows
    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    // Verifies systemic trust clearance indexes
    const trust = await canPost(user.id);
    if (!trust.allowed) throw new Error(trust.reason);

    // Runs textual parsing arrays to isolate safe values
    const cleanTitle = sanitizeContent(input.title).clean.trim();
    const cleanBody = sanitizeContent(input.body).clean.trim();

    if (!cleanTitle) throw new Error("Thread title is required.");
    if (!cleanBody) throw new Error("Post body is required.");

    const threadId = randomUUID();
    const now = new Date();

    // Database Insertion Task 1: Initialize the structural parent thread track record
    await db
        .insert(forumThread)
        .values({
            id: threadId,
            boardId: input.boardId,
            userId: user.id,
            title: cleanTitle,
            postCount: 1, // Seeds length calculations at 1 to map the opening thread comment
            lastPostAt: now,
            createdAt: now,
        });

    // Database Insertion Task 2: Append the baseline introductory content comment block
    await db
        .insert(forumPost)
        .values({
            id: randomUUID(),
            threadId,
            userId: user.id,
            body: cleanBody,
            createdAt: now,
            updatedAt: now,
        });

    // Updates reputation scoring modules to account for fresh content additions
    await recordPost(user.id);

    // Flushes layout caches across downstream router trees to update directories instantly
    revalidatePath("/forum");
    return {threadId};
}

/**
 * An asynchronous Next.js Server Action that appends a reply comment record onto an existing discussion thread.
 *
 * @param {Object} input - Structural payload arguments.
 * @param {string} input.threadId - Unique operational identifier mapping onto the target topic row container.
 * @param {string} input.body - Raw message body text submitted by the client component.
 * @param {string} [input.replyToUserId] - Optional target user identification reference to structure direct quote
 *                                         references.
 *
 * @throws {Error} Throws exceptions if text sanitization leaves fields empty or if validation barriers drop tokens.
 *
 * @returns {Promise<void>} Resolves cleanly once mutations save and path representations clear caches.
 */
export async function replyToThreadAction(
    input: {
        threadId: string;
        body: string;
        replyToUserId?: string;
    }): Promise<void> {
    const user = await requireUser();

    // System-level block filter evaluation
    const status = await getPostingStatus(user.id, "forum");
    if (status === "banned" || status === "muted") {
        throw new Error(`Posting not allowed: ${status}`);
    }

    // Validates that blocklists or privacy parameters do not cross path limits
    if (input.replyToUserId) {
        const ok = await canInteract(user.id, input.replyToUserId);
        if (!ok) {
            throw new Error("You cannot reply to this user.");
        }
    }

    // Baseline reputation validation metrics verification pass
    const trust = await canPost(user.id);
    if (!trust.allowed) {
        throw new Error(trust.reason);
    }

    const cleanBody = sanitizeContent(input.body).clean.trim();
    if (!cleanBody) {
        throw new Error("Post body is required.");
    }

    const now = new Date();

    // Database Operation Step 1: Append the safe child post-entry row
    await db
        .insert(forumPost)
        .values({
            id: randomUUID(),
            threadId: input.threadId,
            userId: user.id,
            body: cleanBody,
            replyToUserId: input.replyToUserId ?? null, // Persists explicit quote pointers or records clean null indices
            createdAt: now,
            updatedAt: now,
        });

    // Database Operation Step 2: Atomic incrementation update adjusting aggregate parent statistics
    await db
        .update(forumThread)
        .set({
            // Uses inline sql helper templates to safely prevent race condition counter corruption errors
            postCount: sql`${forumThread.postCount}
            + 1`,
            lastPostAt: now, // Bumps activity timestamps to lift topics to directory list headers
        })
        .where(eq(forumThread.id, input.threadId));

    // Advances user interaction logs
    await recordPost(user.id);

    // Injects system alerts out into messaging pipelines to track notifications logs
    if (input.replyToUserId) {
        await notify({
            userId: input.replyToUserId,
            type: "reply",
            payload: {module: "forum", threadId: input.threadId, fromUserId: user.id},
        });
    }

    revalidatePath("/forum");
}
