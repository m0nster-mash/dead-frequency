import {relations} from "drizzle-orm";
import {boolean, index, integer, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {authorColumns} from "@shared/communication/author/lib/author";

export const forumCategory = pgTable("forum_category", {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumBoard = pgTable(
    "forum_board",
    {
        id: text("id").primaryKey(),
        categoryId: text("category_id")
            .notNull()
            .references(() => forumCategory.id, {onDelete: "cascade"}),
        label: text("label").notNull(),
        description: text("description"),
        sortOrder: integer("sort_order").notNull().default(0),
        // null = site-wide board; non-null = guild-scoped (Task 9 future-proofing,
        // per the issue's "keep a nullable context_id" guidance).
        contextId: text("context_id"),
        allowsCharacterPosting: boolean("allows_character_posting").notNull().default(false),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [index("forum_board_category_idx").on(table.categoryId)],
);

export const forumThread = pgTable(
    "forum_thread",
    {
        id: text("id").primaryKey(),
        boardId: text("board_id")
            .notNull()
            .references(() => forumBoard.id, {onDelete: "cascade"}),
        ...authorColumns,
        title: text("title").notNull(),
        pinned: boolean("pinned").notNull().default(false),
        locked: boolean("locked").notNull().default(false),
        postCount: integer("post_count").notNull().default(0),
        lastPostAt: timestamp("last_post_at").defaultNow().notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        deletedAt: timestamp("deleted_at"), // soft delete keeps it auditable, matches comment table pattern
    },
    (table) => [
        index("forum_thread_board_idx").on(table.boardId),
        index("forum_thread_last_post_idx").on(table.boardId, table.lastPostAt),
    ],
);

export const forumPost = pgTable(
    "forum_post",
    {
        id: text("id").primaryKey(),
        threadId: text("thread_id")
            .notNull()
            .references(() => forumThread.id, {onDelete: "cascade"}),
        ...authorColumns,
        body: text("body").notNull(),
        // Lightweight "replying to @user" reference — not true nesting.
        replyToUserId: text("reply_to_user_id").references(() => user.id, {onDelete: "set null"}),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [index("forum_post_thread_idx").on(table.threadId)],
);

export const forumBoardRelations = relations(forumBoard, ({one, many}) => ({
    category: one(forumCategory, {fields: [forumBoard.categoryId], references: [forumCategory.id]}),
    threads: many(forumThread),
}));

export const forumThreadRelations = relations(forumThread, ({one, many}) => ({
    board: one(forumBoard, {fields: [forumThread.boardId], references: [forumBoard.id]}),
    author: one(user, {fields: [forumThread.userId], references: [user.id]}),
    posts: many(forumPost),
}));

export const forumPostRelations = relations(forumPost, ({one}) => ({
    thread: one(forumThread, {fields: [forumPost.threadId], references: [forumThread.id]}),
    author: one(user, {fields: [forumPost.userId], references: [user.id]}),
    replyToUser: one(user, {fields: [forumPost.replyToUserId], references: [user.id]}),
}));
