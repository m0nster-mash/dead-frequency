import {relations} from "drizzle-orm";
import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {AvatarConfig} from "@/feature/avatar/lib/types";

/**
 * Core relational table representation storing custom user avatar configurations.
 * Connects directly to the central authentication model via a strict one-to-one mapping relationship.
 */
export const avatarConfig =
    pgTable("avatar_config", {
        /**
         * Binds rows directly down to matching core user records. Purging user profiles triggers an automatic
         * cascading delete sweeping corresponding data records out of this table.
         */
        userId: text("user_id")
            .primaryKey()
            .references(() => user.id, { onDelete: "cascade" }),

        /**
         * Type-Safe JSONB Parameter Object - leverages PostgreSQL jsonb column formatting for rapid parsing. Utilizes
         * Drizzle's `.$type<Type>()` macro to compile strict schema checks ensuring inner properties map perfectly to
         * the AvatarConfig interface.
         */
        config: jsonb("config")
            .$type<AvatarConfig>(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        /**
         * Automatically intercepts database save updates to overwrite timestamps with fresh client execution periods.
         */
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    });

/**
 * Drizzle ORM Relational Mapping: avatarConfig Scope. Resolves a safe one-to-one lookup shortcut path back to the
 * parent User model.
 */
export const avatarConfigRelations = relations(avatarConfig, ({one}) => ({
    user: one(user, {
        fields: [avatarConfig.userId],
        references: [user.id],
    }),
}));
