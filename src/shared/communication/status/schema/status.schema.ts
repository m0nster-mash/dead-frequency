import {user} from "@/core/auth/schema/auth.schema";
import {moduleEnum} from "@/shared/communication/moderation/schema/moderation.schema";
import {relations, sql} from "drizzle-orm";
import {index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";

/**
 * System enumeration specifying explicitly defined moderation states that can be administratively applied to restrict
 * or modify a user's posting capabilities.
 */
export const postingStatusEnum = pgEnum("posting_status", [
    "active",       // Standard operational privileges
    "muted",        // Read-only access constraints
    "shadowbanned", // Content remains hidden from public feeds but appears normal to the author
    "banned",       // Absolute hard lockdown restricting system input pathways entirely
]);

/**
 * Administrative user status restriction mapping table. Houses explicit posting restrictions imposed manually by
 * supervisors or safety scripts. Supports granular sub-system isolation boundaries separate from authentication
 * account locks.
 */
export const userStatus = pgTable(
    "user_status", {
        id: text("id")
            .primaryKey(),

        /**
         * Relational user binding links records directly to a matching profile. Purging user profiles triggers an
         * automatic cascading delete sweeping matching status tracking entries completely out of database storage.
         */
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),

        /**
         * Polymorphic Feature Scope Pointer:
         * - null = Configures a global, site-wide restriction block across all communication pipelines.
         * - non-null = Scopes the penalty tightly to an isolated component branch (ex. "forum").
         */
        module: moduleEnum("module"),

        status: postingStatusEnum("status")
            .notNull()
            .default("active"),

        reason: text("reason"),

        expiresAt: timestamp("expires_at"), // Temporal expiration boundary limit token. null = indefinite penalty length

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        /**
         * Automatically logs updated modification intervals on data manipulation queries.
         */
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        /**
         * Enforces a rule restricting accounts to a maximum of one status tracking row per unique (userId, module)
         * coordinate context set. Uses sql`COALESCE(...)` macros since standard SQL specifications allow multiple
         * null values to bypass standard uniqueness checks, ensuring strict unique compliance across null site-wide
         * fields.
         */
        uniqueIndex("user_status_unique_idx").on(
            table.userId,
            table.module,
            sql`COALESCE(
            ${table.module},
            ''
            )`,
        ),
        // Optimizes account lookup routines inside administrative profile drawers
        index("user_status_user_idx").on(table.userId),
    ],
);

/**
 * System enumeration listing behavioral tiers that an account earns or loses automatically based on participation
 * volumes and reputation metric histories.
 */
export const trustLevelEnum = pgEnum("trust_level", [
    "new",          // Default initial onboarding rank tracking newcomers
    "basic",        // Earned tier relaxing basic anti-spam timing caps
    "trusted",      // High-activity level confirming established safe accounts
    "veteran",      // Maximum community reputation status
    "restricted",   // Auto-quarantined penalty rank triggered by high negative signal accumulations
]);

/**
 * Automated system trust, behavior metrics, and anti-spam rate-limiting tracking table. Maintained continuously by
 * server interaction handlers to dynamically scale rate throttles.
 */
export const userTrust = pgTable(
    "user_trust",
    {
        /**
         * Primary index linking trust history directly to a user. Purging profiles auto-clears corresponding trust history entries.
         */
        userId: text("user_id")
            .primaryKey()
            .references(() => user.id, {onDelete: "cascade"}),

        trustLevel: trustLevelEnum("trust_level")
            .notNull()
            .default("new"),

        postCount: integer("post_count")
            .notNull()
            .default(0),

        /**
         * Tracks cumulative negative interactions (such as getting reported, blocked, or muted). Folds behavioral
         * user feedback algorithms directly into account tier evaluations.
         */
        negativeSignalCount: integer("negative_signal_count")
            .notNull()
            .default(0),

        cooldownUntil: timestamp("cooldown_until"), // Active temporal timestamp indicating anti-spam rate-limiting limits

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
);

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: userStatus Scope.
 * Resolves a safe bidirectional reverse lookup path pointing back to the targeted parent User entity.
 */
export const userStatusRelations = relations(userStatus, ({one}) => ({
    user: one(user, {fields: [userStatus.userId], references: [user.id]}),
}));

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: userTrust Scope.
 * Resolves a safe bidirectional reverse lookup path pointing back to the tracked parent User entity.
 */
export const userTrustRelations = relations(userTrust, ({one}) => ({
    user: one(user, {fields: [userTrust.userId], references: [user.id]}),
}));
