import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { user } from '@/core/auth/schema/auth.schema';
import { character } from '@/core/character/schema/character.schema';

export const blog = pgTable('blog', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    characterId: text('characterId').references(() => character.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    isOfficial: boolean('isOfficial').notNull().default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const blogPost = pgTable('blog_post', {
    id: text('id').primaryKey(),
    blogId: text('blogId').notNull().references(() => blog.id, { onDelete: 'cascade' }),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    characterId: text('characterId').references(() => character.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content').notNull(),
    status: text('status').notNull().default('PUBLISHED'), // 'DRAFT' | 'PUBLISHED'
    visibility: text('visibility').notNull().default('PUBLIC'), // 'PUBLIC' | 'SUBSCRIBERS_ONLY' | 'PRIVATE'
    publishedAt: timestamp('publishedAt'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
