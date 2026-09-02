import {relations} from "drizzle-orm";
import {index, jsonb, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";
import {authorColumns} from "@shared/communication/author/lib/author";

// Every table below shares the same (module, record_id) shape. This is
// the "generic attachable interaction" pattern — build it once here,
// every future feature (guild homepage comments, character reactions,
// blog subscriptions) just plugs into these same tables.

export const reportReasonEnum = pgEnum(
    "report_reason", [
        "spam",
        "harassment",
        "inappropriate_content",
        "impersonation",
        "other",
    ]);

export const report = pgTable(
    "report", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
        reporterId: text("reporter_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        reason: reportReasonEnum("reason")
            .notNull(),
        details: text("details"),
        resolved: text("resolved")
            .default("open"), // open | actioned | dismissed
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [index("report_module_record_idx").on(table.module, table.recordId)],
);

export const reaction = pgTable(
    "reaction", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
        ...authorColumns,
        emoji: text("emoji")
            .notNull(), // keep it simple: unicode emoji string
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [index("reaction_module_record_idx").on(table.module, table.recordId)],
);

export const comment = pgTable(
    "comment",
    {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(), // e.g. "blog"
        recordId: text("record_id")
            .notNull(), // e.g. blog post id
        ...authorColumns,
        body: text("body")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        deletedAt: timestamp("deleted_at"), // soft delete so mod actions stay auditable
    },
    (table) => [index("comment_module_record_idx").on(table.module, table.recordId)],
);

export const activityEvent = pgTable(
    "activity_event",
    {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
        eventType: text("event_type")
            .notNull(), // e.g. "blog_published", "character_created"
        actorId: text("actor_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        // Small denormalized payload so the feed doesn't need to join back
        // into the source module's tables to render a line item.
        payload: jsonb("payload").$type<Record<string, unknown>>(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [index("activity_event_created_idx").on(table.createdAt)],
);

export const subscription = pgTable(
    "subscription",
    {
        id: text("id")
            .primaryKey(),
        subscriberId: text("subscriber_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        module: moduleEnum("module")
            .notNull(), // e.g. "blog"
        recordId: text("record_id")
            .notNull(), // e.g. blog author's user/character id
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("subscription_subscriber_idx")
            .on(table.subscriberId),
        index("subscription_module_record_idx")
            .on(table.module, table.recordId),
    ],
);

export const reportRelations = relations(report, ({one}) => ({
    reporter: one(user, {
        fields: [report.reporterId],
        references: [user.id],
    }),
}));

export const reactionRelations = relations(reaction, ({one}) => ({
    user: one(user, {
        fields: [reaction.userId],
        references: [user.id],
    }),
}));

export const commentRelations = relations(comment, ({one}) => ({
    user: one(user, {fields: [comment.userId], references: [user.id]}),
}));

export const activityEventRelations = relations(activityEvent, ({one}) => ({
    actor: one(user, {
        fields: [activityEvent.actorId],
        references: [user.id],
    }),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
    subscriber: one(user, {
        fields: [subscription.subscriberId],
        references: [user.id],
    }),
}));
