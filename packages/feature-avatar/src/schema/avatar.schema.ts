import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Unified Modular SVG Avatar Schema.
 * Decoupled owner attribution supporting either core user or character entities.
 */
export const avatar = pgTable("avatar", {

    id: text("id")
        .primaryKey(),

    userId: text("userId")
        .unique(),

    characterId: text("characterId")
        .unique(),

    layerConfig: jsonb("layerConfig")
        .$type<{
            base: string;
            eyes: string;
            hair: string;
            mouth: string;
            [key: string]: string;
        }>()
        .notNull(),

    rasterUrl: text("rasterUrl"),

    createdAt: timestamp("createdAt")
        .notNull()
        .defaultNow(),

    updatedAt: timestamp("updatedAt")
        .notNull()
        .defaultNow(),
});
