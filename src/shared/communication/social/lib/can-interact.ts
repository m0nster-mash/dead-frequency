import {db} from "@/shared/db/client";
import {userBlock} from "../schema/blocks.schema";
import {and, eq, or} from "drizzle-orm";

/**
 * The single check for "can userA send/reply/mention/comment at userB".
 * Every module (DM, mentions, comments, forum replies) calls this instead
 * of re-implementing block logic. Blocking is symmetric here: if either
 * side has blocked the other, interaction is disallowed.
 */
export async function canInteract(userA: string, userB: string): Promise<boolean> {
    if (userA === userB) return true;

    const rows = await db
        .select()
        .from(userBlock)
        .where(
            or(
                and(eq(userBlock.blockerId, userA), eq(userBlock.blockedId, userB)),
                and(eq(userBlock.blockerId, userB), eq(userBlock.blockedId, userA)),
            ),
        )
        .limit(1);

    return rows.length === 0;
}

export async function blockUser(blockerId: string, blockedId: string) {
    await db.insert(userBlock).values({blockerId, blockedId});
    // Optional: log to the shared audit log so block activity is trackable
    // for the future "ranking"/trust-level flagging idea.
    // await logModAction({ module: "dm", recordId: blockedId, action: "mute", moderatorId: blockerId });
}
