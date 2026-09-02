import {relations} from "drizzle-orm";
import {pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

// Roles are site-wide OR scoped to a module/context (e.g. "forum moderator").
// contextId null = global role. Non-null = scoped (e.g. a specific guild
// or forum board id) once that granularity is needed.
export const role = pgTable(
    "role", {
        id: text("id").primaryKey(), // e.g. "admin", "moderator", "trusted"
        label: text("label").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    });

export const userRole = pgTable(
    "user_role", {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        roleId: text("role_id")
            .notNull()
            .references(() => role.id, {onDelete: "cascade"}),
        contextId: text("context_id"), // null = global; guild/board id later
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        primaryKey({columns: [table.userId, table.roleId, table.contextId]}),
    ],
);

export const userRoleRelations = relations(userRole, ({one}) => ({
    user: one(user, {fields: [userRole.userId], references: [user.id]}),
    role: one(role, {fields: [userRole.roleId], references: [role.id]}),
}));