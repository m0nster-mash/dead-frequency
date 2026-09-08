import {mention} from "@shared/communication/mentions/schema/mentions.schema";
import {user} from "@/core/auth/schema/auth.schema";
import {db} from "@shared/db/client";
import {randomUUID} from "crypto";
import {eq} from "drizzle-orm";

/**
 * Parses raw message body text to extract @mentions and creates mention tracking records.
 * Uses a simple regex pattern to identify "@username" references and maps them to user IDs.
 *
 * @param {string} messageId - The ID of the chatbox message containing mentions.
 * @param {string} messageBody - The raw message text to parse for @mentions.
 * @param {string} mentionedByUserId - The ID of the user who authored the message.
 *
 * @returns {Promise<Array>} Array of mention record IDs created, or empty array if no mentions found.
 */
export async function parseAndCreateMentions(
    messageId: string,
    messageBody: string,
    mentionedByUserId: string
): Promise<string[]> {
    // Simple regex to match @username patterns (alphanumeric + underscore)
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = messageBody.matchAll(mentionRegex);

    const createdMentionIds: string[] = [];

    // Iterate through all matched @mentions
    for (const match of matches) {
        const username = match[1];

        // Look up the user by their name/username
        const [targetUser] = await db
            .select({id: user.id})
            .from(user)
            .where(eq(user.name, username))
            .limit(1);

        // Skip if user doesn't exist (invalid mention)
        if (!targetUser) continue;

        // Prevent self-mentions
        if (targetUser.id === mentionedByUserId) continue;

        // Check if this mention already exists to avoid duplicates
        const [existingMention] = await db
            .select()
            .from(mention)
            .where(
                eq(mention.module, "chatbox") &&
                eq(mention.recordId, messageId) &&
                eq(mention.mentionedUserId, targetUser.id) &&
                eq(mention.mentionedByUserId, mentionedByUserId)
            )
            .limit(1);

        if (existingMention) continue;

        // Create the mention record
        const mentionId = randomUUID();
        await db.insert(mention).values({
            id: mentionId,
            module: "chatbox",
            recordId: messageId,
            mentionedUserId: targetUser.id,
            mentionedByUserId,
        });

        createdMentionIds.push(mentionId);
    }

    return createdMentionIds;
}

/**
 * Removes mention records when a message is deleted.
 * Cleans up all mention tracking entries associated with a message.
 *
 * @param {string} messageId - The ID of the message whose mentions should be removed.
 *
 * @returns {Promise<void>} Resolves once mentions are deleted.
 */
export async function deleteMentionsForMessage(messageId: string): Promise<void> {
    // Soft delete mentions associated with the deleted message
    // Note: Using raw SQL delete since we're removing mention records on message deletion
    await db
        .delete(mention)
        .where(
            eq(mention.module, "chatbox") &&
            eq(mention.recordId, messageId)
        );
}
