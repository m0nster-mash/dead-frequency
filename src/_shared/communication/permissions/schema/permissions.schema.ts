import {user} from "@/_core/auth/schema/auth.schema";
import {sql} from "drizzle-orm";
import {pgTable, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";

export const role = pgTable(
    "role", {
        id: text("id")
            .primaryKey(),
        label: text("label")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    });

export const userRole = pgTable(
    "user_role", {
        id: text("id")
            .primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        roleId: text("role_id")
            .notNull()
            .references(() => role.id, {onDelete: "cascade"}),
        contextId: text("context_id"),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        // Unique constraint when contextId is specified
        uniqueIndex("user_role_user_context_unique_idx")
            .on(table.userId, table.roleId, table.contextId)
            .where(sql`${table.contextId}
            IS NOT NULL`),

        // Unique constraint when contextId is NULL (global role)
        uniqueIndex("user_role_user_global_unique_idx")
            .on(table.userId, table.roleId)
            .where(sql`${table.contextId}
            IS NULL`),
    ],
);
