import {relations} from "drizzle-orm";
import {index, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";

export const mention = pgTable(
    "mention",
    {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
        mentionedUserId: text("mentioned_user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        mentionedByUserId: text("mentioned_by_user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("mention_module_record_idx")
            .on(table.module, table.recordId),
        index("mention_mentioned_user_idx")
            .on(table.mentionedUserId),
    ],
);

export const mentionRelations = relations(mention, ({one}) => ({
    mentionedUser: one(
        user, {
            fields: [mention.mentionedUserId],
            references: [user.id],
        }),
    mentionedByUser: one(
        user, {
            fields: [mention.mentionedByUserId],
            references: [user.id],
        }),
}));
