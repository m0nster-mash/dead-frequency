// import { pgTable, text, timestamp, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';
// import { user } from '@/core/auth/schema/auth.schema';
// import { character } from '@/core/character/schema/character.schema';
//
// export const userFriendship = pgTable('user_friendship', {
//     id: text('id').primaryKey(),
//     requesterUserId: text('requesterUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     addresseeUserId: text('addresseeUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     status: text('status').notNull().default('PENDING'), // 'PENDING' | 'ACCEPTED' | 'REJECTED'
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// });
//
// export const characterFriendship = pgTable('character_friendship', {
//     id: text('id').primaryKey(),
//     requesterCharacterId: text('requesterCharacterId').notNull().references(() => character.id, { onDelete: 'cascade' }),
//     addresseeCharacterId: text('addresseeCharacterId').notNull().references(() => character.id, { onDelete: 'cascade' }),
//     status: text('status').notNull().default('PENDING'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// });
//
// export const characterFavorite = pgTable('character_favorite', {
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     characterId: text('characterId').notNull().references(() => character.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
// }, (table) => ({
//     pk: primaryKey({ columns: [table.userId, table.characterId] }),
// }));
//
// export const block = pgTable('block', {
//     id: text('id').primaryKey(),
//     blockerUserId: text('blockerUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     blockedUserId: text('blockedUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     reason: text('reason'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
// }, (table) => ({
//     blockPairIdx: uniqueIndex('block_pair_idx').on(table.blockerUserId, table.blockedUserId),
// }));
//
// export const blockAuditLog = pgTable('block_audit_log', {
//     id: text('id').primaryKey(),
//     actorUserId: text('actorUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     targetUserId: text('targetUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     action: text('action').notNull(),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     ipAddress: text('ipAddress'),
// });
