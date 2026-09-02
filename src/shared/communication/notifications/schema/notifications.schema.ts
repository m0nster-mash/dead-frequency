import {relations} from "drizzle-orm";
import {boolean, index, jsonb, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

export const notificationTypeEnum = pgEnum("notification_type", [
    "mention",
    "dm",
    "mod_action",
    "reply",
    "comment",
    "guild_invite", // future, harmless to reserve now
]);

export const notification = pgTable(
    "notification",
    {
        id: text("id")
            .primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        type: notificationTypeEnum("type")
            .notNull(),

        // Free-form payload per type (e.g. { module, recordId, fromUserId }).
        // Keeps this table generic instead of growing a column per type.
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
        index("notification_user_read_idx")
            .on(table.userId, table.read),
    ],
);

export const notificationRelations = relations(notification, ({one}) => ({
    user: one(
        user, {
            fields: [notification.userId],
            references: [user.id],
        }),
}));