import {user} from "@/core/auth/schema/auth.schema";
import {authorColumns} from "@shared/communication/author/lib/author";
import {relations} from "drizzle-orm";
import {index, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Chatbox conversation container table managing topic-organized message threads.
 * Supports both site-wide and context-scoped (guild-specific) conversations.
 */
export const chatboxConversation = pgTable(
    "chatbox_conversation", {
        id: text("id")
            .primaryKey(),

        /**
         * Polymorphic context scoping parameter:
         * - null = site-wide global conversation.
         * - non-null = guild-scoped or contextual sandbox isolation key.
         */
        contextId: text("context_id"),

        title: text("title")
            .notNull(),

        description: text("description"),

        /**
         * Initial creator of the conversation thread. Cascading delete ensures cleanup
         * when the creator's profile is permanently removed.
         */
        createdByUserId: text("created_by_user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),

        /**
         * Chronological timestamp tracking the most recent message posted to this conversation.
         * Optimizes feed sorting and activity detection algorithms.
         */
        lastMessageAt: timestamp("last_message_at")
            .defaultNow()
            .notNull(),

        messageCount: text("message_count")
            .notNull()
            .default("0"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        /**
         * Soft delete timestamp allows content auditing while removing visibility.
         * Conversations remain queryable for historical reconstruction but hidden from user feeds.
         */
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        // Accelerates context-scoped conversation lookups for guild-specific feeds
        index("chatbox_conversation_context_idx").on(table.contextId),

        // Speeds up activity-based feed sorting and recent conversation discovery
        index("chatbox_conversation_last_message_idx").on(table.contextId, table.lastMessageAt),
    ],
);

/**
 * Chatbox message content table. Stores individual messages within conversations.
 * Integrates with moderation, mentions, reactions, and activity tracking systems.
 */
export const chatboxMessage = pgTable(
    "chatbox_message", {
        id: text("id")
            .primaryKey(),

        /**
         * References the parent conversation container grouping this message logically
         * with related exchanges. Cascading delete ensures cleanup when conversations are purged.
         */
        conversationId: text("conversation_id")
            .notNull()
            .references(() => chatboxConversation.id, {onDelete: "cascade"}),

        /**
         * Embeds standard author metadata columns (userId, characterId) supporting consistent
         * attribution patterns across the platform. Cascading delete preserves message audit trail.
         */
        ...authorColumns,

        /**
         * Raw message body text content. Should be sanitized during insertion and before rendering
         * to prevent XSS and code injection attacks.
         */
        body: text("body")
            .notNull(),

        /**
         * Timestamp recording the exact moment this message was initially created.
         * Used for chronological message ordering and activity logging.
         */
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        /**
         * Automatic timestamp tracking the most recent modification to message body content.
         * Updated on every edit operation to support "edited" indicators in UI.
         */
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),

        /**
         * Soft delete timestamp. When set, the message is logically removed from user feeds
         * but preserved in audit logs for administrative review and historical reconstruction.
         * Only administrators can delete messages—users cannot remove their own messages.
         */
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        // Accelerates chronological message stream queries for a specific conversation
        index("chatbox_message_conversation_idx").on(table.conversationId),

        // Speeds up user activity lookups and message history queries
        index("chatbox_message_user_idx").on(table.userId),

        // Optimizes feed sorting by recent activity across all messages
        index("chatbox_message_created_idx").on(table.conversationId, table.createdAt),
    ],
);

/**
 * Drizzle ORM Relational Mapping: chatboxConversation Scope.
 * Facilitates safe bidirectional queries resolving nested message and user references.
 */
export const chatboxConversationRelations = relations(
    chatboxConversation,
    ({one, many}) => ({
        /**
         * Relational route extracting creator profile details for display and permission checks.
         */
        createdByUser: one(user, {
            fields: [chatboxConversation.createdByUserId],
            references: [user.id],
        }),

        /**
         * Relational shortcut enabling efficient reverse lookups to fetch all messages
         * belonging to a conversation in a single optimized query.
         */
        messages: many(chatboxMessage),
    }),
);

/**
 * Drizzle ORM Relational Mapping: chatboxMessage Scope.
 * Establishes safe lookups for author profiles and parent conversation contexts.
 */
export const chatboxMessageRelations = relations(chatboxMessage, ({one}) => ({
    /**
     * Relational route resolving the parent conversation container this message belongs to.
     */
    conversation: one(chatboxConversation, {
        fields: [chatboxMessage.conversationId],
        references: [chatboxConversation.id],
    }),

    /**
     * Relational route extracting author profile details (name, email, avatar).
     * Remains available even if the primary account is deleted due to left join semantics.
     */
    author: one(user, {
        fields: [chatboxMessage.userId],
        references: [user.id],
    }),
}));
