import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const avatar = pgTable('avatar', {
    id: text('id').primaryKey(),

    // Generic Owner Strings (Decoupled from host tables)
    userId: text('userId').unique(),
    characterId: text('characterId').unique(),

    layerConfig: jsonb('layerConfig').$type<{
        base: string;
        eyes: string;
        hair: string;
        mouth: string;
        [key: string]: string;
    }>().notNull(),

    rasterUrl: text('rasterUrl'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
