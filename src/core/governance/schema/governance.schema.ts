import {boolean, pgTable, primaryKey, text, timestamp} from 'drizzle-orm/pg-core';
import {user} from '../../auth/schema/auth.schema';

// --- System Roles & Multi-Role Junction ---
export const role = pgTable('role', {
    id: text('id').primaryKey(), // 'admin' | 'moderator' | 'user'
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

// --- In-App Posting Sanctions ---
export const userSanction = pgTable('user_sanction', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    issuedByUserId: text('issuedByUserId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    sanctionType: text('sanctionType').notNull(), // 'MUTE' | 'SHADOWBAN' | 'TIMEOUT'
    targetModule: text('targetModule'), // NULL = Site-wide; 'CHATBOX' = Chatbox only
    contextId: text('contextId'), // NULL = Site-wide; guild.id = Guild-scoped
    reason: text('reason').notNull(),
    expiresAt: timestamp('expiresAt'),
    isRevoked: boolean('isRevoked').notNull().default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const sanctionAppeal = pgTable('sanction_appeal', {
    id: text('id').primaryKey(),
    sanctionId: text('sanctionId').notNull().references(() => userSanction.id, {onDelete: 'cascade'}),
    appellantUserId: text('appellantUserId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    appealText: text('appealText').notNull(),
    status: text('status').notNull().default('PENDING'), // 'PENDING' | 'APPROVED' | 'DENIED'
    reviewedByUserId: text('reviewedByUserId').references(() => user.id, {onDelete: 'set null'}),
    reviewNote: text('reviewNote'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    reviewedAt: timestamp('reviewedAt'),
});

// --- Dynamic Module Registry State ---
export const moduleConfig = pgTable('module_config', {
    moduleKey: text('moduleKey').primaryKey(), // 'chatbox' | 'forum' | 'avatar'
    isEnabled: boolean('isEnabled').notNull().default(true),
    maintenanceMessage: text('maintenanceMessage'),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
