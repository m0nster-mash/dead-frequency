// import { pgTable, text, timestamp, boolean, primaryKey, jsonb } from 'drizzle-orm/pg-core';
// import { user } from '@/core/auth/schema/auth.schema';
// import { character } from '@/core/character/schema/character.schema';
//
// export const dmConversation = pgTable('dm_conversation', {
//     id: text('id').primaryKey(),
//     participantAUserId: text('participantAUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     participantACharacterId: text('participantACharacterId').references(() => character.id, { onDelete: 'cascade' }),
//     participantBUserId: text('participantBUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     participantBCharacterId: text('participantBCharacterId').references(() => character.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// });
//
// export const dmMessage = pgTable('dm_message', {
//     id: text('id').primaryKey(),
//     conversationId: text('conversationId').notNull().references(() => dmConversation.id, { onDelete: 'cascade' }),
//     senderUserId: text('senderUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     senderCharacterId: text('senderCharacterId').references(() => character.id, { onDelete: 'cascade' }),
//     content: text('content').notNull(),
//     readAt: timestamp('readAt'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     deletedAt: timestamp('deletedAt'),
// });
//
// export const dmParticipantSettings = pgTable('dm_participant_settings', {
//     conversationId: text('conversationId').notNull().references(() => dmConversation.id, { onDelete: 'cascade' }),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     characterId: text('characterId').references(() => character.id, { onDelete: 'cascade' }),
//     isArchived: boolean('isArchived').notNull().default(false),
//     isClosed: boolean('isClosed').notNull().default(false),
//     isHidden: boolean('isHidden').notNull().default(false),
//     folderName: text('folderName').notNull().default('inbox'),
//     tags: jsonb('tags').$type<string[]>().default([]),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// }, (table) => ({
//     pk: primaryKey({ columns: [table.conversationId, table.userId] }),
// }));
//
// export const dmAccessLog = pgTable('dm_access_log', {
//     id: text('id').primaryKey(),
//     moderatorUserId: text('moderatorUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     conversationId: text('conversationId').notNull().references(() => dmConversation.id, { onDelete: 'cascade' }),
//     reason: text('reason').notNull(),
//     accessedAt: timestamp('accessedAt').notNull().defaultNow(),
//     ipAddress: text('ipAddress'),
// });
