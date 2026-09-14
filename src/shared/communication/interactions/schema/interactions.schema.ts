// import { pgTable, text, timestamp, foreignKey, uniqueIndex } from 'drizzle-orm/pg-core';
// import { user } from '@/core/auth/schema/auth.schema';
// import { character } from '@/core/character/schema/character.schema';
//
// export const comment = pgTable('comment', {
//     id: text('id').primaryKey(),
//     targetModule: text('targetModule').notNull(), // 'BLOG_POST' | 'USER_PROFILE' | 'CHARACTER_PROFILE' | 'GUILD'
//     targetRecordId: text('targetRecordId').notNull(),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     characterId: text('characterId').references(() => character.id, { onDelete: 'cascade' }),
//     content: text('content').notNull(),
//     parentCommentId: text('parentCommentId'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
//     deletedAt: timestamp('deletedAt'),
// }, (table) => ({
//     parentFk: foreignKey({
//         columns: [table.parentCommentId],
//         foreignColumns: [table.id],
//     }).onDelete('set null'),
// }));
//
// export const reaction = pgTable('reaction', {
//     id: text('id').primaryKey(),
//     targetModule: text('targetModule').notNull(),
//     targetRecordId: text('targetRecordId').notNull(),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     emojiType: text('emojiType').notNull(), // 'like' | 'heart' | 'fire' | 'skull'
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
// }, (table) => ({
//     userTargetIdx: uniqueIndex('reaction_user_target_idx').on(table.userId, table.targetModule, table.targetRecordId),
// }));
