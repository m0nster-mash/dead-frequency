import {user} from "@/core/auth/schema/auth.schema";
import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Core Character entity representing roleplay persona identities.
 */
export const character = pgTable("character", {
    id: text("id").primaryKey(),
    ownerUserId: text("ownerUserId")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    deletedAt: timestamp("deletedAt"),
});

/**
 * Character Profile extension for bio and localized styling.
 */
export const characterProfile = pgTable("character_profile", {
    id: text("id").primaryKey(),
    characterId: text("characterId")
        .notNull()
        .unique()
        .references(() => character.id, {onDelete: "cascade"}),
    bio: text("bio"),
    themeConfig: jsonb("themeConfig"),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
