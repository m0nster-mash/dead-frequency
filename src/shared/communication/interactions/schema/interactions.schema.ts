import {user} from "@/core/auth/schema/auth.schema";
import {authorColumns} from "@shared/communication/author/lib/author";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";
import {relations} from "drizzle-orm";
import {index, jsonb, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";

// NOTE TO SELF::
// Every table below shares the same (module, record_id) shape. This is
// the "generic attachable interaction" pattern — build it once here,
// every future feature (guild homepage comments, character reactions,
// blog subscriptions) just plugs into these same tables.

/**
 * System enumeration listing acceptable categorization classifications for submitting moderation safety reports.
 */
export const reportReasonEnum = pgEnum(
    "report_reason", [
        "spam",
        "harassment",
        "inappropriate_content",
        "impersonation",
        "other",
    ]);

/**
 * Attachable moderation report log table. Captures user-submitted safety grievances across any system feature module
 * via polymorphic composite identifiers.
 */
export const report = pgTable(
    "report", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(), // The polymorphic target module string identifier (ex. "forum")
        recordId: text("record_id")
            .notNull(), // The dynamic source document key id being filed against
        reporterId: text("reporter_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        reason: reportReasonEnum("reason")
            .notNull(),
        details: text("details"),
        resolved: text("resolved")
            .default("open"), // Centralized queue posture tracking: open | actioned | dismissed
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    // Accelerates moderation panel lookup queries searching rows by content modules
    (table) => [
        index("report_module_record_idx").on(table.module, table.recordId)],
);

/**
 * Attachable sentiment reaction table. Tracks simple Unicode string interactions pinned onto any structural
 * record across the application.
 */
export const reaction = pgTable(
    "reaction", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),

        // Unpacks consistent metadata schema columns tracking originators (ex. userId, characterId).
        ...authorColumns,
        emoji: text("emoji")
            .notNull(), // Unicode emoji raw text string parameter representation
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [index("reaction_module_record_idx").on(table.module, table.recordId)],
);

/**
 * Attachable polymorphic user comment feed table. Powers flat discussion streams across disparate text targets
 * (such as blogs or custom modules).
 */
export const comment = pgTable(
    "comment",
    {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(), // Target structural sub-system pointer context (ex. "blog")
        recordId: text("record_id")
            .notNull(), // Source parent element target index (ex. blog post uuid)
        ...authorColumns,
        body: text("body")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        // Automatically logs updated modification intervals on data manipulation queries.
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        deletedAt: timestamp("deleted_at"), // Soft delete timestamp allows content auditing while removing visibility
    },
    (table) => [index("comment_module_record_idx").on(table.module, table.recordId)],
);

/**
 * Centralized activity log and event feed entry logging table. Denormalizes data blocks inside unstructured JSON
 * payloads to accelerate lookups on feed listings.
 */
export const activityEvent = pgTable(
    "activity_event", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
        eventType: text("event_type")
            .notNull(), // Transaction class type signature string descriptors (ex. "character_created")
        actorId: text("actor_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        /**
         * Leverages PostgreSQL jsonb column parameters. Stores minimal view context fragments (such as actor name
         * labels or link targets) to bypass expensive multi-table join lookups when compiling social feeds.
         */
        payload: jsonb("payload").$type<Record<string, unknown>>(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) =>
        [index("activity_event_created_idx").on(table.createdAt)],
);

/**
 * Attachable sub-system notification subscription configuration tracking table. Links user preferences to polymorphic
 * updates across accounts or entities.
 */
export const subscription = pgTable(
    "subscription", {
        id: text("id")
            .primaryKey(),
        subscriberId: text("subscriber_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        module: moduleEnum("module")
            .notNull(),
        recordId: text("record_id")
            .notNull(),
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

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: report Scope.
 */
export const reportRelations = relations(report, ({one}) => ({
    reporter: one(user, {
        fields: [report.reporterId],
        references: [user.id],
    }),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: reaction Scope.
 */
export const reactionRelations = relations(reaction, ({one}) => ({
    user: one(user, {
        fields: [reaction.userId],
        references: [user.id],
    }),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: comment Scope.
 */
export const commentRelations = relations(comment, ({one}) => ({
    user: one(user, {fields: [comment.userId], references: [user.id]}),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: activityEvent Scope.
 */
export const activityEventRelations = relations(activityEvent, ({one}) => ({
    actor: one(user, {
        fields: [activityEvent.actorId],
        references: [user.id],
    }),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: subscription Scope.
 */
export const subscriptionRelations = relations(subscription, ({one}) => ({
    subscriber: one(user, {
        fields: [subscription.subscriberId],
        references: [user.id],
    }),
}));
