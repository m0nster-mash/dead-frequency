import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Core Character entity representing roleplay persona identities.
 *
 * `ownerUserId` intentionally stores a plain, unconstrained id rather than a foreign key into the
 * host's `users` table — feature packages do not hold hard references into another package's
 * schema. This keeps the package's schema self-contained and extractable.
 */
export const character =
    pgTable("character", {

        id: text("id")
            .primaryKey(),

        ownerUserId: text("ownerUserId")
            .notNull(),

        name: text("name")
            .notNull(),

        slug: text("slug")
            .notNull(),

        createdAt: timestamp("createdAt")
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updatedAt")
            .notNull()
            .defaultNow(),

        deletedAt: timestamp("deletedAt"),
    });

/**
 * Character Profile extension for bio and localized styling.
 * References `character` directly — this is an intra-package relationship,
 * so a real foreign key with cascade delete is appropriate here.
 */
export const characterProfile =
    pgTable("character_profile", {

        id: text("id")
            .primaryKey(),

        characterId: text("characterId")
            .notNull()
            .unique()
            .references(() => character.id, {onDelete: "cascade"}),

        bio: text("bio"),

        themeConfig: jsonb("themeConfig"),

        updatedAt: timestamp("updatedAt")
            .notNull()
            .defaultNow(),
    });
