import {user} from "@/core/auth/schema/auth.schema";
import {relations} from "drizzle-orm";
import {index, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * System-wide central enum registry enumerating every active feature module on the platform. Centralizing this
 * dictionary blocks disparate feature columns or microservices from experiencing type definition drift during
 * modular extensions.
 */
export const moduleEnum = pgEnum(
    "module_name", [
        "forum",
        "chatbox",
        "chatroom",
        "dm",
        "avatar_elements",
        "blog",
        "comment",
        "site"
    ]);

/**
 * Operational action type enum dictionary mapping out legal structural mutations that administrators or logging tools
 * can commit against system targets.
 */
export const modActionEnum = pgEnum(
    "mod_action", [
        "edit",
        "delete",
        "mute",
        "unmute",
        "shadowban",
        "ban",
        "unban",
        "pin",
        "unpin",
    ]);

/**
 * High-security systemic audit log persistence table. Records continuous regulatory metrics tracking enforcement
 * modifications or security overrides.
 */
export const auditLog = pgTable(
    "audit_log", {
        id: text("id")
            .primaryKey(),
        module: moduleEnum("module") // Target sub-system pointer context (ex. "forum")
            .notNull(),
        recordId: text("record_id") // Source index identifier tracking the underlying item mutation
            .notNull(),
        action: modActionEnum("action") // The explicit action class logged by administrative modules
            .notNull(),

        /**
         * Binds row parameters directly to the checking moderator's user entry ID. Overwrites target identifiers with
         * clean null markers if moderator profiles drop off the platform to maintain system compliance logs.
         */
        moderatorId: text("moderator_id")
            .notNull()
            .references(() => user.id, {onDelete: "set null"}),

        /**
         * Maps the recipient profile receiving structural corrections or standing restrictions. Differs from content
         * authors (ex. clearing a thread that targets a third-party account profile).
         */
        targetUserId: text("target_user_id")
            .references(() => user.id, {
                onDelete: "set null",
            }),
        reason: text("reason"),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        // Index Map 1: Accelerates data lookups inside specialized historical review panel logs
        index("audit_log_module_record_idx").on(table.module, table.recordId),

        // Index Map 2: Optimizes reporting lookups aggregating metrics tracking a specific admin's throughput
        index("audit_log_moderator_idx").on(table.moderatorId),

        // Index Map 3: Speeds up account standing histories rendered inside administrative profile drawers
        index("audit_log_target_user_idx").on(table.targetUserId),
    ],
);

/**
 * Drizzle ORM Relational Mapping: auditLog Scope.  Facilitates safe single-step queries resolving user object
 * parameters from data storage.
 */
export const auditLogRelations = relations(auditLog, ({one}) => ({
    // Relational route extracting display descriptors for the supervisor who ran the script action
    moderator: one(user, {
        fields: [auditLog.moderatorId],
        references: [user.id],
    }),

    // Relational route isolating profile metrics for the account subjected to enforcement changes
    targetUser: one(user, {
        fields: [auditLog.targetUserId],
        references: [user.id],
    }),
}));
