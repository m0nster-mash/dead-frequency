import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const chatboxMessage = pgTable('chatbox_message', {
    id: text('id').primaryKey(),
    contextId: text('contextId'), // NULL = Global; guild.id = Guild-scoped

    // Generic Author Strings (Decoupled from host tables)
    userId: text('userId').notNull(),
    characterId: text('characterId'),

    message: text('message').notNull(),
    isPinned: boolean('isPinned').notNull().default(false),

    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    deletedAt: timestamp('deletedAt'),
});
