import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Unified Modular SVG Avatar Schema.
 * Decoupled owner attribution supporting either core user or character entities.
 */
export const avatar = pgTable("avatar", {
    id: text("id").primaryKey(),

    // Decoupled Owner Attribution (unique standalone text identifiers)
    userId: text("userId").unique(),
    characterId: text("characterId").unique(),

    // Modular Layer Configuration (Layer key -> Asset ID / filename)
    layerConfig: jsonb("layerConfig")
        .$type<{
            base: string;
            eyes: string;
            hair: string;
            mouth: string;
            [key: string]: string;
        }>()
        .notNull(),

    // Pre-rendered/rasterized cache URL
    rasterUrl: text("rasterUrl"),

    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
