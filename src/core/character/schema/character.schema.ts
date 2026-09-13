import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema/auth.schema';

export const character = pgTable('character', {
    id: text('id').primaryKey(),
    ownerUserId: text('ownerUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    deletedAt: timestamp('deletedAt'),
});

export const characterProfile = pgTable('character_profile', {
    id: text('id').primaryKey(),
    characterId: text('characterId').notNull().unique().references(() => character.id, { onDelete: 'cascade' }),
    bio: text('bio'),
    bannerUrl: text('bannerUrl'),
    themeConfig: jsonb('themeConfig'),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
