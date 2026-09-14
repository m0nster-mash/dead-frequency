import {boolean, foreignKey, integer, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Forum Subsystem Schema (Categories -> Boards -> Threads -> Posts).
 * Internal parent-child FKs are preserved, while host user references are generic text columns.
 */
export const forumCategory = pgTable("forum_category", {
    id: text("id").primaryKey(),
    contextId: text("contextId"),
    name: text("name").notNull(),
    orderIndex: integer("orderIndex").notNull().default(0),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const forumBoard = pgTable("forum_board", {
    id: text("id").primaryKey(),
    categoryId: text("categoryId")
        .notNull()
        .references(() => forumCategory.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    description: text("description"),
    boardType: text("boardType").notNull().default("STANDARD"),
    allowsCharacterPosting: boolean("allowsCharacterPosting").notNull().default(true),
    orderIndex: integer("orderIndex").notNull().default(0),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const forumThread = pgTable("forum_thread", {
    id: text("id").primaryKey(),
    boardId: text("boardId")
        .notNull()
        .references(() => forumBoard.id, {onDelete: "cascade"}),
    // Decoupled Thread Starter ID
    userId: text("userId").notNull(),
    characterId: text("characterId"),
    title: text("title").notNull(),
    isPinned: boolean("isPinned").notNull().default(false),
    isLocked: boolean("isLocked").notNull().default(false),

    postCount: integer("postCount").notNull().default(1),
    lastPostAt: timestamp("lastPostAt").notNull().defaultNow(),

    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const forumPost = pgTable(
    "forum_post",
    {
        id: text("id").primaryKey(),
        threadId: text("threadId")
            .notNull()
            .references(() => forumThread.id, {onDelete: "cascade"}),
        // Decoupled Author Account ID
        userId: text("userId").notNull(),
        characterId: text("characterId"),
        content: text("content").notNull(),

        replyToPostId: text("replyToPostId"),

        createdAt: timestamp("createdAt").notNull().defaultNow(),
        updatedAt: timestamp("updatedAt").notNull().defaultNow(),
        deletedAt: timestamp("deletedAt"),
    },
    (table) => ({
        replyFk: foreignKey({
            columns: [table.replyToPostId],
            foreignColumns: [table.id],
        }).onDelete("set null"),
    })
);
