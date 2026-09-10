import {user} from "@/core/auth/schema/auth.schema";
import {relations, sql} from "drizzle-orm";
import {pgTable, text, timestamp, uniqueIndex} from "drizzle-orm/pg-core";

/**
 * Structural master role definition dictionary table. Maintains system-wide permission tier string constants and
 * human-readable metadata labels.
 */
export const role = pgTable(
    "role", {
        id: text("id").primaryKey(), // Primary lookup key string identifier (ex. "admin", "moderator")
        label: text("label").notNull(), // User-facing description label (ex. "System Administrator")
        createdAt: timestamp("created_at").defaultNow().notNull(),
    });

/**
 * Relational join mapping table assigning structural permission roles to specific user accounts. Flexibly configures
 * privileges to span global boundaries or lock down to isolated modules.
 */
export const userRole = pgTable(
    "user_role", {
        id: text("id").primaryKey(), // Generated UUID primary key token string assigned on record insert

        /**
         * Links permissions directly down to a matching profile. Purging user profiles triggers an automatic
         * cascading delete sweeping corresponding data records out of this table.
         */
        userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),

        // links rows to verified mastery permission groups. Deleting master roles purges corresponding assignments.
        roleId: text("role_id").notNull().references(() => role.id, {onDelete: "cascade"}),

        /**
         * Context Scoping Parameter:
         * - null = Assigned permissions apply globally site-wide.
         * - non-null = Scoped to a specific module sandbox instance (ex. guild ID or forum board ID).
         */
        contextId: text("context_id"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        /**
         * Prevents redundant overlapping data mappings for identical users, roles, and contexts.
         * Uses sql`COALESCE(...)` macros since standard SQL specifications allow multiple null values to bypass
         * standard uniqueness checks, ensuring strict unique compliance across null contexts.
         */
        uniqueIndex("user_role_unique_idx").on(
            table.userId,
            table.roleId,
            sql`COALESCE(
            ${table.contextId},
            ''
            )`,
        ),
    ],
);

/**
 * TODO:: implement feature or delete function
 *
 * Drizzle ORM Relational Mapping: userRole Scope.
 * Resolves safe bidirectional reverse lookup paths pointing back to parent entities.
 */
export const userRoleRelations = relations(userRole, ({one}) => ({
    // Relational shortcut path pulling profile parameters for the assigned account holder
    user: one(user, {fields: [userRole.userId], references: [user.id]}),
    // Relational shortcut path extracting configuration definitions for the associated role string
    role: one(role, {fields: [userRole.roleId], references: [role.id]}),
}));
