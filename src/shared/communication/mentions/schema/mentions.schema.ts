import {relations} from "drizzle-orm";
import {index, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";

/**
 * Attachable polymorphic mention index table. Captures user-to-user handle parsing entries ("@username") across
 * any system feature module (such as forum posts, chat boxes, or comments) using a generic multi-tenant pattern.
 */
export const mention = pgTable(
    "mention",
    {
        id: text("id")
            .primaryKey(),

        module: moduleEnum("module")
            .notNull(), // The polymorphic target module string identifier (ex. "forum", "chatbox")

        recordId: text("record_id")
            .notNull(), // The unique source document key id containing the raw text handle references

        /*
           Target Relational Binding: Connects to the user account profile being mentioned.
           Cascade Configuration: Purging this account cleanly wipes all corresponding mention row records out of the table.
        */
        mentionedUserId: text("mentioned_user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        /*
           Originator Relational Binding: Connects to the user account that authored the text content.
           Cascade Configuration: Purging the author profile triggers a cascading delete sweeping row indices out.
        */
        mentionedByUserId: text("mentioned_by_user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        // Composite Index: Accelerates cleanup sweeps and module tracking queries pulling rows matching content objects
        index("mention_module_record_idx")
            .on(table.module, table.recordId),

        // Individual Index: Speeds up user dashboard query notifications filtering by the targeted user's ID
        index("mention_mentioned_user_idx")
            .on(table.mentionedUserId),
    ],
);

/**
 * TODO:: implement function or delete
 *
 * Establishes safe lookups dividing row parameters cleanly between targeted users and origin authors.
 */
export const mentionRelations = relations(mention, ({one}) => ({
    // Relational route resolving details for the profile that received the notification mention trace
    mentionedUser: one(
        user, {
            fields: [mention.mentionedUserId],
            references: [user.id],
        }),

    // Relational route resolving details for the author who generated the comment handles
    mentionedByUser: one(
        user, {
            fields: [mention.mentionedByUserId],
            references: [user.id],
        }),
}));
