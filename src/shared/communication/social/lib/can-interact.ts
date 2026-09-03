import {db} from "@/shared/db/client";
import {and, eq, or} from "drizzle-orm";
import {userBlock} from "../schema/blocks.schema";

/**
 * Centrally evaluates interpersonal access permissions to determine if communication is allowed between two user
 * accounts.
 *
 * Secure feature flow:
 * 1. Self-Interaction Check: Instantly permits transactions if the target profile matches the originator identity
 *    string.
 * 2. Symmetric Blocking Evaluation: Queries the central `userBlock` table using a cross-join condition.
 *    - Check A: Has User A manually restricted User B?
 *    - Check B: Has User B manually restricted User A?
 * 3. Enforces a symmetric blocking model: If *either* security connection vector is flagged, the entire transaction is
 *    rejected.
 *
 * Every feature system (direct messaging, comment modules, notification mentions, or forum replies)
 * MUST pass parameters through this hook instead of hand-rolling localized block definitions.
 *
 * @param {string} userA - The unique identifier primary key of the primary user initiating an interaction.
 * @param {string} userB - The unique identifier primary key of the destination target user receiving an interaction.
 *
 * @returns {Promise<boolean>} A promise resolving to true if no matching block entries exist and social interaction
 *                             is fully allowed.
 */
export async function canInteract(userA: string, userB: string): Promise<boolean> {
    // Users are always permitted to communicate or interact with their own profile records
    if (userA === userB) return true;

    // Searches for active interpersonal restrictions in either direction
    const rows = await db
        .select()
        .from(userBlock)
        .where(
            /**
             * Funnels constraints through an logical OR condition to ensure that if either account has active block
             * parameters saved, the communication loop remains locked down.
             */
            or(
                and(eq(userBlock.blockerId, userA), eq(userBlock.blockedId, userB)), // User A blocked User B
                and(eq(userBlock.blockerId, userB), eq(userBlock.blockedId, userA)), // User B blocked User A
            ),
        )
        .limit(1); // Clamps lookup ranges to optimize driver execution speeds

    return rows.length === 0;
}

/**
 * Persists a new manual isolation record between two users inside the data persistence layer.
 *
 * @param {string} blockerId - The unique user identification key string of the member implementing the isolation guard.
 * @param {string} blockedId - The unique user identification key string of the account targeted for communication
 *                             restriction.
 *
 * @returns {Promise<void>} A promise resolving once the block record successfully saves to database storage.
 */
export async function blockUser(blockerId: string, blockedId: string): Promise<void> {
    // Inserts blocking linkage records directly into the blocks schema configuration
    await db.insert(userBlock).values({blockerId, blockedId});

    // Optional placeholder anchor: log to the shared audit log so block activity is trackable for the future
    // "ranking"/trust-level flagging idea.
    // await logModAction({ module: "dm", recordId: blockedId, action: "mute", moderatorId: blockerId });
}
