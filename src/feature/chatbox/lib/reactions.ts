import {reaction} from "@shared/communication/interactions/schema/interactions.schema";
import {db} from "@shared/db/client";
import {randomUUID} from "crypto";
import {and, eq} from "drizzle-orm";

/**
 * Adds an emoji reaction to a chatbox message.
 * Prevents duplicate reactions from the same user on the same message.
 *
 * @param {string} messageId - The ID of the message to react to.
 * @param {string} emoji - The emoji string (e.g., "👍", "❤️", "😂").
 * @param {string} userId - The ID of the user adding the reaction.
 * @param {string} [characterId] - Optional character ID if reacting as a character.
 *
 * @throws {Error} Throws if reaction creation fails.
 *
 * @returns {Promise<string>} The ID of the created reaction.
 */
export async function addReaction(
    messageId: string,
    emoji: string,
    userId: string,
    characterId?: string
): Promise<string> {
    // Check if this user has already reacted with this emoji to this message
    const [existingReaction] = await db
        .select()
        .from(reaction)
        .where(
            and(
                eq(reaction.module, "chatbox"),
                eq(reaction.recordId, messageId),
                eq(reaction.emoji, emoji),
                eq(reaction.userId, userId)
            )
        )
        .limit(1);

    // Return existing reaction if already present
    if (existingReaction) {
        return existingReaction.id;
    }

    // Create new reaction record
    const reactionId = randomUUID();
    await db.insert(reaction).values({
        id: reactionId,
        module: "chatbox",
        recordId: messageId,
        userId,
        characterId: characterId ?? null,
        emoji,
    });

    return reactionId;
}

/**
 * Removes a specific emoji reaction from a message.
 * Only the user who added the reaction can remove it.
 *
 * @param {string} messageId - The ID of the message.
 * @param {string} emoji - The emoji to remove.
 * @param {string} userId - The ID of the user removing the reaction (must be the original reactor).
 *
 * @throws {Error} Throws if the reaction doesn't exist or user is not authorized.
 *
 * @returns {Promise<void>} Resolves once the reaction is deleted.
 */
export async function removeReaction(
    messageId: string,
    emoji: string,
    userId: string
): Promise<void> {
    // Verify the reaction exists and belongs to this user
    const [existingReaction] = await db
        .select()
        .from(reaction)
        .where(
            and(
                eq(reaction.module, "chatbox"),
                eq(reaction.recordId, messageId),
                eq(reaction.emoji, emoji),
                eq(reaction.userId, userId)
            )
        )
        .limit(1);

    if (!existingReaction) {
        throw new Error("Reaction not found or you do not have permission to remove it.");
    }

    // Delete the reaction
    await db
        .delete(reaction)
        .where(eq(reaction.id, existingReaction.id));
}

/**
 * Fetches all reactions on a specific message, aggregated by emoji.
 *
 * @param {string} messageId - The ID of the message.
 *
 * @returns {Promise<Array>} Array of reaction objects grouped by emoji with counts and reactor list.
 */
export async function getMessageReactions(messageId: string) {
    const reactions = await db
        .select()
        .from(reaction)
        .where(
            and(
                eq(reaction.module, "chatbox"),
                eq(reaction.recordId, messageId)
            )
        );

    // Group reactions by emoji
    const grouped = reactions.reduce(
        (acc, curr) => {
            if (!acc[curr.emoji]) {
                acc[curr.emoji] = [];
            }
            acc[curr.emoji].push({
                userId: curr.userId,
                characterId: curr.characterId,
            });
            return acc;
        },
        {} as Record<string, Array<{userId: string; characterId: string | null}>>
    );

    // Convert to array format with counts
    return Object.entries(grouped).map(([emoji, reactors]) => ({
        emoji,
        count: reactors.length,
        reactors,
    }));
}

/**
 * Removes all reactions from a message when the message is deleted.
 * Cleans up reaction records associated with the deleted message.
 *
 * @param {string} messageId - The ID of the message whose reactions should be removed.
 *
 * @returns {Promise<void>} Resolves once all reactions are deleted.
 */
export async function deleteReactionsForMessage(messageId: string): Promise<void> {
    await db
        .delete(reaction)
        .where(
            and(
                eq(reaction.module, "chatbox"),
                eq(reaction.recordId, messageId)
            )
        );
}
