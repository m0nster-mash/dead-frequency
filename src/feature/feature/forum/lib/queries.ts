import {asc, eq} from "drizzle-orm";
import {db} from "@shared/db/client";
import {user} from "@/core/auth/schema/auth.schema";
import {forumBoard, forumCategory, forumPost, forumThread} from "@/feature/forum/schema/forum.schema";

/** All categories with their boards, ordered for the /forum index page. */
export async function getForumHierarchy() {
    const categories = await db
        .select()
        .from(forumCategory)
        .orderBy(asc(forumCategory.sortOrder));

    const boards = await db
        .select()
        .from(forumBoard)
        .orderBy(asc(forumBoard.sortOrder));

    return categories.map((category) => ({
        ...category,
        boards: boards.filter((board) => board.categoryId === category.id),
    }));
}

export async function getCategoryWithBoards(categoryId: string) {
    const [category] = await db
        .select()
        .from(forumCategory)
        .where(eq(forumCategory.id, categoryId))
        .limit(1);

    if (!category) return null;

    const boards = await db
        .select()
        .from(forumBoard)
        .where(eq(forumBoard.categoryId, categoryId))
        .orderBy(asc(forumBoard.sortOrder));

    return {...category, boards};
}

export async function getBoardWithThreads(boardId: string) {
    const [board] = await db
        .select()
        .from(forumBoard)
        .where(eq(forumBoard.id, boardId))
        .limit(1);

    if (!board) return null;

    const threads = await db
        .select({
            id: forumThread.id,
            title: forumThread.title,
            pinned: forumThread.pinned,
            locked: forumThread.locked,
            postCount: forumThread.postCount,
            lastPostAt: forumThread.lastPostAt,
            createdAt: forumThread.createdAt,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(forumThread)
        .leftJoin(user, eq(forumThread.userId, user.id))
        .where(eq(forumThread.boardId, boardId))
        .orderBy(asc(forumThread.lastPostAt));

    return {...board, threads};
}

export async function getThreadWithPosts(threadId: string) {
    const [thread] = await db
        .select()
        .from(forumThread)
        .where(eq(forumThread.id, threadId))
        .limit(1);

    if (!thread) return null;

    const posts = await db
        .select({
            id: forumPost.id,
            body: forumPost.body,
            createdAt: forumPost.createdAt,
            updatedAt: forumPost.updatedAt,
            deletedAt: forumPost.deletedAt,
            replyToUserId: forumPost.replyToUserId,
            authorName: user.name,
            authorEmail: user.email,
        })
        .from(forumPost)
        .leftJoin(user, eq(forumPost.userId, user.id))
        .where(eq(forumPost.threadId, threadId))
        .orderBy(asc(forumPost.createdAt));

    return {thread, posts};
}
