import { user } from "@/core/auth/schema/auth.schema";
import { authorColumns } from "@shared/communication/author/lib/author";
import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Global site-wide chatbox messages table.
 * Stores individual messages with author information and timestamps.
 * Supports soft deletes and simple audit trail via updatedAt.
 */
export const chatboxMessage = pgTable(
    "chatbox_message", {
        id: text("id")
            .primaryKey(),

        // Author identification using standard author column pattern
        ...authorColumns,

        // Message content
        body: text("body")
            .notNull(),

        // Timestamps for audit trail and sorting
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),

        // Soft delete support for content moderation
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        // Accelerate queries by user (for user's own messages, activity tracking)
        index("chatbox_message_user_idx").on(table.userId),

        // Accelerate chronological queries for feed retrieval
        index("chatbox_message_created_idx").on(table.createdAt),

        // Composite index for pagination: fetch messages created after timestamp
        index("chatbox_message_created_deleted_idx").on(table.createdAt, table.deletedAt),
    ],
);

/**
 * Drizzle ORM Relational Mapping: chatboxMessage Scope.
 * Links messages to their authors.
 */
export const chatboxMessageRelations = relations(chatboxMessage, ({ one }) => ({
    author: one(user, {
        fields: [chatboxMessage.userId],
        references: [user.id],
    }),
}));
