// import {user} from "@/core/auth/schema/auth.schema";
// import {forumBoard, forumCategory, forumPost, forumThread} from "@/feature/forum/schema/forum.schema";
// import {db} from "@/shared/db/client";
// import {asc, desc, eq} from "drizzle-orm";
//
// /**
//  * Fetches and composites the complete forum schema catalog structure. Queries base collections and constructs
//  * multi-tier relational arrays on the application server layer.
//  */
// export async function getForumHierarchy() {
//     const categories = await db
//         .select()
//         .from(forumCategory)
//         .orderBy(asc(forumCategory.sortOrder));
//
//     // pull down flat list of all boards across the system
//     const boards = await db
//         .select()
//         .from(forumBoard)
//         .orderBy(asc(forumBoard.sortOrder));
//
//     /**
//      * Iterates across category records, matching and sorting corresponding child board arrays locally to avoid
//      * complex SQL grouping or redundant network round trips.
//      */
//     return categories.map(
//         (category) => ({
//             ...category,
//             boards: boards.filter((board) =>
//                 board.categoryId === category.id)
//         }));
// }
//
// /**
//  * Isolates an individual forum category record along with its nested child discussion boards.
//  *
//  * @param {string} categoryId - The unique primary identifier of the target category to search for.
//  */
// export async function getCategoryWithBoards(categoryId: string) {
//     // query target metadata block, utilizing defensive limit caps to optimize driver scans
//     const [category] = await db
//         .select()
//         .from(forumCategory)
//         .where(eq(forumCategory.id, categoryId))
//         .limit(1);
//
//     // return null safely if the container category row is missing
//     if (!category) return null;
//
//     // isolate specific sub-boards belonging exclusively to the validated parent key context
//     const boards = await db
//         .select()
//         .from(forumBoard)
//         .where(eq(forumBoard.categoryId, categoryId))
//         .orderBy(asc(forumBoard.sortOrder));
//
//     return {...category, boards};
// }
//
// /**
//  * Resolves directory listings for a single forum board, assembling its topic threads alongside author descriptors.
//  *
//  * @param {string} boardId - The unique primary identifier of the target board to scan.
//  */
// export async function getBoardWithThreads(boardId: string) {
//     const [board] = await db
//         .select()
//         .from(forumBoard)
//         .where(eq(forumBoard.id, boardId))
//         .limit(1);
//
//     if (!board) return null;
//
//     /**
//      * Performs a left join linking threads to the user schema to extract author identity parameters (`name`, `email`)
//      * while protecting rows from dropping if profiles are deleted.
//      */
//     const threads = await db
//         .select({
//             id: forumThread.id,
//             boardId: forumThread.boardId,
//             title: forumThread.title,
//             pinned: forumThread.pinned,
//             locked: forumThread.locked,
//             postCount: forumThread.postCount,
//             lastPostAt: forumThread.lastPostAt,
//             createdAt: forumThread.createdAt,
//             userId: forumThread.userId,
//             authorName: user.name,
//             authorEmail: user.email,
//         })
//         .from(forumThread)
//         .leftJoin(user, eq(forumThread.userId, user.id))
//         .where(eq(forumThread.boardId, boardId))
//         /**
//          *  1. Prioritizes sticky topic targets (`pinned` descending) to pin chosen discussions to the top layout.
//          *  2. Organizes inner sections chronologically (`lastPostAt` descending) to float active threads up the
//          *     directory tree.
//          */
//         .orderBy(desc(forumThread.pinned), desc(forumThread.lastPostAt));
//
//     return {...board, threads};
// }
//
// /**
//  * Hydrates a detailed topic viewport by retrieving target thread metrics alongside its chronological post discussion
//  * feed.
//  *
//  * @param {string} threadId - The unique primary identifier of the conversation thread to resolve.
//  */
// export async function getThreadWithPosts(threadId: string) {
//     // fetch parent discussion topic properties, stitching user identities via a Left Outer Join
//     const [thread] = await db
//         .select({
//             id: forumThread.id,
//             boardId: forumThread.boardId,
//             title: forumThread.title,
//             pinned: forumThread.pinned,
//             locked: forumThread.locked,
//             postCount: forumThread.postCount,
//             lastPostAt: forumThread.lastPostAt,
//             createdAt: forumThread.createdAt,
//             userId: forumThread.userId,
//             authorName: user.name,
//             authorEmail: user.email,
//         })
//         .from(forumThread)
//         .leftJoin(user, eq(forumThread.userId, user.id))
//         .where(eq(forumThread.id, threadId))
//         .limit(1);
//
//     if (!thread) return null;
//
//     // fetch the chronological log stream of comment entries linked directly to the parent thread parameter
//     const posts = await db
//         .select({
//             id: forumPost.id,
//             threadId: forumPost.threadId,
//             userId: forumPost.userId,
//             body: forumPost.body,
//             createdAt: forumPost.createdAt,
//             updatedAt: forumPost.updatedAt,
//             deletedAt: forumPost.deletedAt, // kept in projection layers to support custom soft-deletion message redacting
//             replyToUserId: forumPost.replyToUserId,
//             authorName: user.name,
//             authorEmail: user.email,
//         })
//         .from(forumPost)
//         .leftJoin(user, eq(forumPost.userId, user.id))
//         .where(eq(forumPost.threadId, threadId))
//         .orderBy(asc(forumPost.createdAt)); // orders responses ascending to maintain linear discussion continuity
//
//     // Extract the body content of the very first post (OP)
//     const opBody = posts.length > 0 ? posts[0].body : null;
//
//     return { thread, posts, opBody };
// }
