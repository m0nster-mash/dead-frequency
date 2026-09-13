import {user} from "@/_core/auth/schema/auth.schema";
import {pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";

/**
 * Relational join mapping table tracking interpersonal social isolation guards and blocks between accounts.
 * Enforces strict uniqueness constraints across individual connection pairs to block redundant records.
 */
export const userBlock = pgTable(
    "user_block",
    {
        /**
         * Links rows to the account holder initializing the blocking guard. Purging this account cleanly wipes all
         * corresponding outward block records.
         */
        blockerId: text("blocker_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),

        /**
         * Links rows to the target account targeted for social restriction. Purging the target account auto-deletes
         * inbound block pointers to clean up database space.
         */
        blockedId: text("blocked_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        /**
         * Combines both identification parameters to serve as the absolute row identity tracker. Guarantees that
         * Blocker A can only block Target B exactly once, blocking duplicated rows.
         */
        primaryKey({columns: [table.blockerId, table.blockedId]})
    ],
);
