import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { user } from '@/core/auth/schema/auth.schema';

export const report = pgTable('report', {
    id: text('id').primaryKey(),
    targetModule: text('targetModule').notNull(), // 'FORUM_POST' | 'BLOG_POST' | 'COMMENT' | 'CHATBOX_MESSAGE'
    targetRecordId: text('targetRecordId').notNull(),
    reporterUserId: text('reporterUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    status: text('status').notNull().default('PENDING'), // 'PENDING' | 'RESOLVED' | 'DISMISSED'
    resolvedByUserId: text('resolvedByUserId').references(() => user.id, { onDelete: 'set null' }),
    resolutionNote: text('resolutionNote'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    resolvedAt: timestamp('resolvedAt'),
});

export const auditLog = pgTable('auditLog', {
    id: text('id').primaryKey(),
    actorUserId: text('actorUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    actionType: text('actionType').notNull(),
    targetModule: text('targetModule'),
    targetRecordId: text('targetRecordId'),
    targetUserId: text('targetUserId').references(() => user.id, { onDelete: 'set null' }),
    metadata: jsonb('metadata'),
    ipAddress: text('ipAddress'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const wordFilter = pgTable('word_filter', {
    id: text('id').primaryKey(),
    pattern: text('pattern').notNull(),
    matchMode: text('matchMode').notNull().default('EXACT'), // 'EXACT' | 'CONTAINS' | 'REGEX'
    action: text('action').notNull().default('REPLACE'), // 'REPLACE' | 'BLOCK' | 'FLAG'
    replacement: text('replacement').default('***'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
