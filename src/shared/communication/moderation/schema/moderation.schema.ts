import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { user } from "@/core/auth/schema/auth.schema";
import {UserStatus} from "@shared/constants/UserStatus";

// 1. Polymorphic User Reports Queue
export const report = pgTable("report", {
    id: text("id").primaryKey(),
    targetModule: text("targetModule").notNull(), // 'FORUM_POST' | 'BLOG_POST' | 'COMMENT' | 'CHATBOX_MESSAGE' | 'USER_PROFILE' | 'USERS'
    targetRecordId: text("targetRecordId").notNull(),
    reporterUserId: text("reporterUserId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    status: text("status").notNull().default(UserStatus.PENDING), // 'PENDING' | 'RESOLVED' | 'DISMISSED'
    resolvedByUserId: text("resolvedByUserId").references(() => user.id, { onDelete: "set null" }),
    resolutionNote: text("resolutionNote"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    resolvedAt: timestamp("resolvedAt"),
});

// 2. Immutable Moderation Audit Trail
export const auditLog = pgTable("auditLog", {
    id: text("id").primaryKey(),
    actorUserId: text("actorUserId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    actionType: text("actionType").notNull(), // 'USER_MUTED' | 'USER_EDITED' | 'POST_DELETED' | 'REPORT_RESOLVED'
    targetModule: text("targetModule"),
    targetRecordId: text("targetRecordId"),
    targetUserId: text("targetUserId").references(() => user.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    ipAddress: text("ipAddress"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// 3. Granular User Posting Sanctions
export const userSanction = pgTable("user_sanction", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    issuedByUserId: text("issuedByUserId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    sanctionType: text("sanctionType").notNull(), // 'MUTE' | 'SHADOWBAN' | 'TIMEOUT' | 'RESTRICT'
    targetModule: text("targetModule"), // NULL = Site-wide; 'CHATBOX' = Chatbox only
    contextId: text("contextId"), // NULL = Site-wide; guild.id = Guild-scoped
    reason: text("reason").notNull(),
    expiresAt: timestamp("expiresAt"),
    isRevoked: boolean("isRevoked").notNull().default(false),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// 4. Configurable Word & Pattern Filter
export const wordFilter = pgTable("word_filter", {
    id: text("id").primaryKey(),
    pattern: text("pattern").notNull(),
    matchMode: text("matchMode").notNull().default("EXACT"), // 'EXACT' | 'CONTAINS' | 'REGEX'
    action: text("action").notNull().default("REPLACE"), // 'REPLACE' | 'BLOCK' | 'FLAG'
    replacement: text("replacement").default("***"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// 5. Module Feature Toggles
export const moduleConfig = pgTable("module_config", {
    moduleKey: text("moduleKey").primaryKey(), // 'chatbox' | 'forum' | 'blogs' | 'avatars'
    isEnabled: boolean("isEnabled").notNull().default(true),
    maintenanceMessage: text("maintenanceMessage"),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
