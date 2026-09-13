import {user} from '@/core/auth/schema/auth.schema';
import {character} from '@/core/character/schema/character.schema';
import {jsonb, pgTable, primaryKey, text, timestamp} from 'drizzle-orm/pg-core';

export const guild = pgTable(
    'guild', {

        id: text('id')
            .primaryKey(),

        ownerUserId: text('ownerUserId')
            .notNull()
            .references(() => user.id, {onDelete: 'cascade'}),

        name: text('name')
            .notNull(),

        slug: text('slug')
            .notNull()
            .unique(),

        description: text('description'),

        themeConfig: jsonb('themeConfig'),

        createdAt: timestamp('createdAt')
            .notNull()
            .defaultNow(),

        updatedAt: timestamp('updatedAt')
            .notNull()
            .defaultNow(),

        deletedAt: timestamp('deletedAt'),
    });

export const guildUserMember = pgTable(
    'guild_user_member', {
        guildId: text('guildId')
            .notNull()
            .references(() => guild.id, {onDelete: 'cascade'}),
        userId: text('userId')
            .notNull()
            .references(() => user.id, {onDelete: 'cascade'}),
        rank: text('rank')
            .notNull()
            .default('MEMBER'), // 'OWNER' | 'MODERATOR' | 'MEMBER'
        status: text('status')
            .notNull()
            .default('PENDING'), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'
        joinedAt: timestamp('joinedAt')
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updatedAt')
            .notNull()
            .defaultNow(),
    }, (table) => ({
        pk: primaryKey({columns: [table.guildId, table.userId]}),
    }));

export const guildCharacterMember = pgTable(
    'guild_character_member', {
        guildId: text('guildId')
            .notNull()
            .references(() => guild.id, {onDelete: 'cascade'}),
        characterId: text('characterId')
            .notNull()
            .references(() => character.id, {onDelete: 'cascade'}),
        status: text('status')
            .notNull()
            .default('PENDING'),
        joinedAt: timestamp('joinedAt')
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updatedAt')
            .notNull()
            .defaultNow(),
    }, (table) => ({
        pk: primaryKey({columns: [table.guildId, table.characterId]}),
    }));
