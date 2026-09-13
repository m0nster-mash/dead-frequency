// import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
// import { user } from '@/core/auth/schema/auth.schema';
// import { character } from '@/core/character/schema/character.schema';
//
// export const notification = pgTable('notification', {
//     id: text('id').primaryKey(),
//     recipientUserId: text('recipientUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     eventType: text('eventType').notNull(), // 'MENTION' | 'DM' | 'REACTION' | 'FRIEND_REQUEST' | 'BLOG_POST'
//     actorUserId: text('actorUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     actorCharacterId: text('actorCharacterId').references(() => character.id, { onDelete: 'cascade' }),
//     targetModule: text('targetModule').notNull(),
//     targetRecordId: text('targetRecordId').notNull(),
//     payload: jsonb('payload'),
//     readAt: timestamp('readAt'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
// });
//
// export const subscription = pgTable('subscription', {
//     id: text('id').primaryKey(),
//     subscriberUserId: text('subscriberUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     subscriberCharacterId: text('subscriberCharacterId').references(() => character.id, { onDelete: 'cascade' }),
//     targetType: text('targetType').notNull(), // 'BLOG' | 'USER' | 'CHARACTER' | 'GUILD'
//     targetId: text('targetId').notNull(),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
// });
