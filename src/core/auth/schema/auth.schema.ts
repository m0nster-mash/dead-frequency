import {boolean, integer, jsonb, pgTable, primaryKey, text, timestamp} from 'drizzle-orm/pg-core';

// --- BetterAuth Native Core ---
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expiresAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    password: text('password'),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// --- RBAC & Governance ---
export const role = pgTable('role', {
    id: text('id').primaryKey(), // 'admin' | 'moderator' | 'member'
    name: text('name').notNull(),
    description: text('description'),
    bypassesCooldown: boolean('bypassesCooldown').notNull().default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const userRole = pgTable('user_role', {
    userId: text('userId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    roleId: text('roleId').notNull().references(() => role.id, {onDelete: 'cascade'}),
    assignedAt: timestamp('assignedAt').notNull().defaultNow(),
}, (table) => ({
    pk: primaryKey({columns: [table.userId, table.roleId]}),
}));

// --- User Extensions ---
export const userProfile = pgTable('user_profile', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().unique().references(() => user.id, {onDelete: 'cascade'}),
    bio: text('bio'),
    bannerUrl: text('bannerUrl'),
    themeConfig: jsonb('themeConfig'),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const userStats = pgTable('user_stats', {
    userId: text('userId').primaryKey().references(() => user.id, {onDelete: 'cascade'}),
    forumPostCount: integer('forumPostCount').notNull().default(0),
    chatMessageCount: integer('chatMessageCount').notNull().default(0),
    chatboxMessageCount: integer('chatboxMessageCount').notNull().default(0),
    commentCount: integer('commentCount').notNull().default(0),
    trustScore: integer('trustScore').notNull().default(0),
    lastPostedAt: timestamp('lastPostedAt'),
});
