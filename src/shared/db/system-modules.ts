import {boolean, pgTable, text, timestamp} from "drizzle-orm/pg-core";

export const systemModules = pgTable("system_modules", {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    name: text("name").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
