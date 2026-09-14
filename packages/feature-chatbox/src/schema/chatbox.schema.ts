import {boolean, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Portable Chatbox Shoutbox Message Schema.
 * Completely decoupled with standalone text columns for user and context IDs.
 */
export const chatboxMessage = pgTable("chatbox_message", {

    id: text("id")
        .primaryKey(),

    // Scoped Context (null = Site-wide Shoutbox; guildId = Guild-scoped Shoutbox)
    contextId: text("contextId"),

    userId: text("userId")
        .notNull(),

    characterId: text("characterId"),

    message: text("message")
        .notNull(),

    isPinned: boolean("isPinned")
        .notNull()
        .default(false),

    createdAt: timestamp("createdAt")
        .notNull()
        .defaultNow(),

    updatedAt: timestamp("updatedAt")
        .notNull()
        .defaultNow(),

    deletedAt: timestamp("deletedAt"),
});
