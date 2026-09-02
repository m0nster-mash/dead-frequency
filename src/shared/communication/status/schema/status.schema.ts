import {relations} from "drizzle-orm";
import {index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";

// Posting-privilege state, separate from better-auth's account-level `banned`.
// null module = site-wide; non-null = scoped to one module (mirrors the
// permissions module's contextId pattern from Task 1).
export const postingStatusEnum = pgEnum("posting_status", [
    "active",
    "muted",
    "shadowbanned",
    "banned",
]);

export const userStatus = pgTable(
    "user_status",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        module: moduleEnum("module"), // null = site-wide
        status: postingStatusEnum("status").notNull().default("active"),
        reason: text("reason"),
        expiresAt: timestamp("expires_at"), // null = indefinite
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        // One active status row per (user, module-or-sitewide).
        uniqueIndex("user_status_unique_idx").on(
            table.userId,
            table.module,
        ),
        index("user_status_user_idx").on(table.userId),
    ],
);

// Trust level is separate from posting status: status is something a mod
// imposes, trust is something the user earns/loses automatically.
export const trustLevelEnum = pgEnum("trust_level", [
    "new",
    "basic",
    "trusted",
    "veteran",
    "restricted", // demoted — mirrors the "frequently blocked/reported" idea
]);

export const userTrust = pgTable(
    "user_trust",
    {
        userId: text("user_id")
            .primaryKey()
            .references(() => user.id, {onDelete: "cascade"}),
        trustLevel: trustLevelEnum("trust_level").notNull().default("new"),
        postCount: integer("post_count").notNull().default(0),
        // How many times this user has been reported/blocked/muted — feeds
        // the "ranking" idea from the issue, folded into this same table
        // instead of a separate system.
        negativeSignalCount: integer("negative_signal_count").notNull().default(0),
        cooldownUntil: timestamp("cooldown_until"), // simple posting-rate cooldown
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
);

export const userStatusRelations = relations(userStatus, ({one}) => ({
    user: one(user, {fields: [userStatus.userId], references: [user.id]}),
}));

export const userTrustRelations = relations(userTrust, ({one}) => ({
    user: one(user, {fields: [userTrust.userId], references: [user.id]}),
}));
