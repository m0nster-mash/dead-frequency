import {user} from "@/core/auth/schema/auth.schema";
import {authorColumns} from "@shared/communication/author/lib/author";
import {relations} from "drizzle-orm";
import {boolean, index, integer, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Top-level organizational grouping table separating forum topics by logical categories.
 */
export const forumCategory = pgTable(
    "forum_category", {
        id: text("id")
            .primaryKey(),
        label: text("label")
            .notNull(),
        sortOrder: integer("sort_order")
            .notNull()
            .default(0),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    });

/**
 * Forum board container layout table managing targeted content feeds. Includes future-proofing structures for modular
 * group/guild routing rules.
 */
export const forumBoard = pgTable(
    "forum_board", {
        id: text("id")
            .primaryKey(),
        /**
         * Connects boards directly down to distinct categories. Purging categories cleanly sweeps all sub-boards out
         * of the database.
         */
        categoryId: text("category_id")
            .notNull()
            .references(() => forumCategory.id, {onDelete: "cascade"}),
        label: text("label")
            .notNull(),
        description: text("description"),
        sortOrder: integer("sort_order")
            .notNull()
            .default(0),
        /**
         * Future-proofing:
         * null = site-wide global board.
         * non-null = guild-scoped or contextual sandbox isolation keys per design rules.
         */
        contextId: text("context_id"),
        allowsCharacterPosting: boolean("allows_character_posting")
            .notNull()
            .default(false),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    // Speeds up dashboard catalog aggregations filtering by category keys
    (table) =>
        [index("forum_board_category_idx").on(table.categoryId)],
);

/**
 * Topic structural metadata table managing specific conversation branches.
 */
export const forumThread = pgTable(
    "forum_thread", {
        id: text("id")
            .primaryKey(),
        boardId: text("board_id")
            .notNull()
            .references(() => forumBoard.id, {onDelete: "cascade"}),

        // Unpacks consistent metadata schema columns tracking originators (ex. userId, authorName).
        ...authorColumns,
        title: text("title")
            .notNull(),
        pinned: boolean("pinned")
            .notNull()
            .default(false),
        locked: boolean("locked")
            .notNull()
            .default(false),
        postCount: integer("post_count")
            .notNull()
            .default(0),
        lastPostAt: timestamp("last_post_at")
            .defaultNow()
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        // Soft delete timestamp allows content auditing while removing visibility
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        index("forum_thread_board_idx").on(table.boardId),

        // Accelerates chronological catalog indexing, sorting sticky or active topics within structural boards.
        index("forum_thread_last_post_idx").on(table.boardId, table.lastPostAt),
    ],
);

/**
 * Content storage table containing granular conversation entries and user comments.
 */
export const forumPost = pgTable(
    "forum_post", {
        id: text("id")
            .primaryKey(),
        threadId: text("thread_id")
            .notNull()
            .references(() => forumThread.id, {onDelete: "cascade"}),
        ...authorColumns,
        body: text("body").notNull(),

        /**
         * Maps conversational targets to model simple quote references without full tree nesting parameters and
         * evicts reference linkages cleanly if the destination profile is permanently purged.
         */
        replyToUserId: text("reply_to_user_id").references(
            () => user.id, {onDelete: "set null"}),
        createdAt: timestamp("created_at").defaultNow().notNull(),

        // Automatically logs updated modification intervals on data manipulation queries.
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [index("forum_post_thread_idx").on(table.threadId)],
);

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: forumBoard Scope.
 */
export const forumBoardRelations = relations(forumBoard, ({one, many}) => ({
    category: one(forumCategory, {fields: [forumBoard.categoryId], references: [forumCategory.id]}),
    threads: many(forumThread),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: forumThread Scope.
 */
export const forumThreadRelations = relations(forumThread, ({one, many}) => ({
    board: one(forumBoard, {fields: [forumThread.boardId], references: [forumBoard.id]}),
    author: one(user, {fields: [forumThread.userId], references: [user.id]}),
    posts: many(forumPost),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: forumPost Scope.
 */
export const forumPostRelations = relations(forumPost, ({one}) => ({
    thread: one(forumThread, {fields: [forumPost.threadId], references: [forumThread.id]}),
    author: one(user, {fields: [forumPost.userId], references: [user.id]}),
    replyToUser: one(user, {fields: [forumPost.replyToUserId], references: [user.id]}),
}));
