import {pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

export const userBlock = pgTable(
    "user_block",
    {
        blockerId: text("blocker_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        blockedId: text("blocked_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [primaryKey({columns: [table.blockerId, table.blockedId]})],
);