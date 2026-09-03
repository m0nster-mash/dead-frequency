import {user} from "@/core/auth/schema/auth.schema";
import {forumBoard, forumCategory, forumPost, forumThread} from "@/feature/forum/schema/forum.schema";
import {db} from "@shared/db/client";
import {asc, desc, eq} from "drizzle-orm";

/**
 * Fetches and composites the complete forum schema catalog structure.
 * Queries base collections and constructs multi-tier relational arrays on the application server layer.
 *
 * @returns {Promise<Array<Object>>} A promise resolving to a hierarchical tree of categories containing nested child boards.
 */
export async function getForumHierarchy(): Promise<Array<object>> {
    // Collect categories ordered by their designated layout sequence indices
    const categories = await db
        .select()
        .from(forumCategory)
        .orderBy(asc(forumCategory.sortOrder));

    // Pull down flat list of all boards across the system
    const boards = await db
        .select()
        .from(forumBoard)
        .orderBy(asc(forumBoard.sortOrder));

    /*
       Iterates across category records, matching and sorting corresponding child board arrays
       locally to avoid complex SQL grouping or redundant network round trips.
    */
    return categories.map((category) => ({
        ...category,
        boards: boards.filter((board) => board.categoryId === category.id),
    }));
}

/**
 * Isolates an individual forum category record along with its nested child discussion boards.
 *
 * @param {string} categoryId - The unique primary identifier of the target category to search for.
 *
 * @returns {Promise<Object | null>} A promise resolving to the composite category block, or null if the record doesn't exist.
 */
export async function getCategoryWithBoards(categoryId: string): Promise<object | null> {
    // Query target metadata block, utilizing defensive limit caps to optimize driver scans
    const [category] = await db
        .select()
        .from(forumCategory)
        .where(eq(forumCategory.id, categoryId))
        .limit(1);

    // Validation Guard: Return null safely if the container category row is missing
    if (!category) return null;

    // Isolate specific sub-boards belonging exclusively to the validated parent key context
    const boards = await db
        .select()
        .from(forumBoard)
        .where(eq(forumBoard.categoryId, categoryId))
        .orderBy(asc(forumBoard.sortOrder));

    return {...category, boards};
}

/**
 * Resolves directory listings for a single forum board, assembling its topic threads alongside author descriptors.
 *
 * @param {string} boardId - The unique primary identifier of the target board to scan.
 *
 * @returns {Promise<Object | null>} A promise resolving to the board metadata nested with its topics, or null if missing.
 */
export async function getBoardWithThreads(boardId: string): Promise<object | null> {
    const [board] = await db
        .select()
        .from(forumBoard)
        .where(eq(forumBoard.id, boardId))
        .limit(1);

    if (!board) return null;

    /*
       Performs a left join linking threads to the user schema to extract author identity parameters
       (`name`, `email`) while protecting rows from dropping if profiles are deleted.
    */
    const threads = await db
        .select({
            id: forumThread.id,
            boardId: forumThread.boardId,
            title: forumThread.title,
            pinned: forumThread.pinned,
            locked: forumThread.locked,
            postCount: forumThread.postCount,
            lastPostAt: forumThread.lastPostAt,
            createdAt: forumThread.createdAt,
            userId: forumThread.userId,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(forumThread)
        .leftJoin(user, eq(forumThread.userId, user.id))
        .where(eq(forumThread.boardId, boardId))
        /*
           Compound Sorting Flow:
           1. Prioritizes sticky topic targets (`pinned` descending) to pin chosen discussions to the top layout.
           2. Organizes inner sections chronologically (`lastPostAt` descending) to float active threads up the directory tree.
        */
        .orderBy(desc(forumThread.pinned), desc(forumThread.lastPostAt));

    return {...board, threads};
}

/**
 * Hydrates a detailed topic viewport by retrieving target thread metrics alongside its chronological post discussion feed.
 *
 * @param {string} threadId - The unique primary identifier of the conversation thread to resolve.
 *
 * @returns {Promise<Object | null>} A promise resolving to a compound object containing thread details and post arrays, or null.
 */
export async function getThreadWithPosts(threadId: string): Promise<object | null> {
    // Fetch parent discussion topic properties, stitching user identities via a Left Outer Join
    const [thread] = await db
        .select({
            id: forumThread.id,
            boardId: forumThread.boardId,
            title: forumThread.title,
            pinned: forumThread.pinned,
            locked: forumThread.locked,
            postCount: forumThread.postCount,
            lastPostAt: forumThread.lastPostAt,
            createdAt: forumThread.createdAt,
            userId: forumThread.userId,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(forumThread)
        .leftJoin(user, eq(forumThread.userId, user.id))
        .where(eq(forumThread.id, threadId))
        .limit(1);

    if (!thread) return null;

    // Fetch the chronological log stream of comment entries linked directly to the parent thread parameter
    const posts = await db
        .select({
            id: forumPost.id,
            threadId: forumPost.threadId,
            userId: forumPost.userId,
            body: forumPost.body,
            createdAt: forumPost.createdAt,
            updatedAt: forumPost.updatedAt,
            deletedAt: forumPost.deletedAt, // Kept in projection layers to support custom soft-deletion message redacting
            replyToUserId: forumPost.replyToUserId,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(forumPost)
        .leftJoin(user, eq(forumPost.userId, user.id))
        .where(eq(forumPost.threadId, threadId))
        .orderBy(asc(forumPost.createdAt)); // Orders responses ascending to maintain linear discussion continuity

    return {thread, posts};
}
