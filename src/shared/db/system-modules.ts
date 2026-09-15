import {boolean, pgTable, timestamp, varchar} from 'drizzle-orm/pg-core';

export const systemModules = pgTable('system_modules', {
    key: varchar('key', {length: 64}).primaryKey(),
    isEnabled: boolean('is_enabled').default(true).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SystemModuleSelect = typeof systemModules.$inferSelect;
export type SystemModuleInsert = typeof systemModules.$inferInsert;
