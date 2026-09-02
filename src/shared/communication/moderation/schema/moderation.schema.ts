import {relations} from "drizzle-orm";
import {index, pgEnum, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

// Extend this enum as new modules come online. Keep it centralized so
// there's exactly one list of valid module names across the app.
export const moduleEnum = pgEnum(
    "module_name", [
        "forum",
        "chatbox",
        "chatroom",
        "dm",
        "avatar_elements",
        "blog",
        "comment",
    ]);

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

export const auditLog = pgTable(
    "audit_log",
    {
        id: text("id").primaryKey(),
        module: moduleEnum("module").notNull(),
        recordId: text("record_id").notNull(),
        action: modActionEnum("action").notNull(),
        moderatorId: text("moderator_id")
            .notNull()
            .references(() => user.id, {onDelete: "set null"}),

        // Who the action targeted (ex. the banned/muted user), not always the same as the record's
        // author (ex. deleting someone's post that mentions another user).
        targetUserId: text("target_user_id").references(() => user.id, {
            onDelete: "set null",
        }),
        reason: text("reason"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("audit_log_module_record_idx").on(table.module, table.recordId),
        index("audit_log_moderator_idx").on(table.moderatorId),
        index("audit_log_target_user_idx").on(table.targetUserId),
    ],
);

export const auditLogRelations = relations(auditLog, ({one}) => ({
    moderator: one(user, {
        fields: [auditLog.moderatorId],
        references: [user.id],
    }),
    targetUser: one(user, {
        fields: [auditLog.targetUserId],
        references: [user.id],
    }),
}));
