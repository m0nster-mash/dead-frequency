import {relations} from "drizzle-orm";
import {boolean, index, jsonb, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

/**
 * System-wide enumeration defining acceptable classification categories for notification alerts.
 * Centralizing this index list supports extensible future features without breaking ongoing schema mappings.
 */
export const notificationTypeEnum = pgEnum("notification_type", [
    "mention",
    "dm",
    "mod_action",
    "reply",
    "comment",
    "guild_invite", // Future-proofing: Reserved now to streamline downstream module integrations harmlessly
]);

/**
 * Relational database table managing transactional alert logs for individual user profiles.
 * Implements a polymorphic, lightweight notification framework tailored for performant list aggregations.
 */
export const notification = pgTable(
    "notification",
    {
        id: text("id")
            .primaryKey(),

        /*
           Target User Alignment Binding: Connects alerts directly down to matching recipient profiles.
           Cascade Configuration: Purging this account cleanly wipes all corresponding user notifications out of storage.
        */
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        type: notificationTypeEnum("type")
            .notNull(),

        /*
           Polymorphic Schema Metadata Payload:
           Leverages PostgreSQL jsonb column parameters for rapid extraction.
           Stores free-form payload contexts (ex. { module, recordId, fromUserId }) variant on the `type` tag.
           Keeps this table generic instead of growing a new column per category type addition.
        */
        payload: jsonb("payload")
            .$type<Record<string, unknown>>(),

        read: boolean("read")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        /*
           Compound Index Optimization:
           Accelerates user dashboard listings and navigation counts by organizing indexes
           directly matching standard toggle parameters (`userId` + `read`).
        */
        index("notification_user_read_idx")
            .on(table.userId, table.read),
    ],
);

/**
 * Drizzle ORM Relational Mapping: notification Scope.
 * Resolves a safe one-to-many reverse lookup path pointing directly back to the target account profile.
 */
export const notificationRelations = relations(notification, ({one}) => ({
    user: one(
        user, {
            fields: [notification.userId],
            references: [user.id],
        }),
}));
