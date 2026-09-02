import {text} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";

/**
 * Shared "author" columns every content-bearing table should include.
 * userId is always required. characterId is nullable until the Character
 * System exists — leave it null, never omit it. Retrofitting this later
 * means migrating every module at once instead of one column now.
 *
 * Usage in a module schema:
 *
 *   export const forumPost = pgTable("forum_post", {
 *     id: text("id").primaryKey(),
 *     ...authorColumns,
 *     body: text("body").notNull(),
 *   });
 */
export const authorColumns = {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    // No FK yet — the `character` table doesn't exist. Add the reference
    // once the Character System schema lands; until then this is just a
    // nullable text column reserved for that id.
    characterId: text("character_id"),
};

export type Author = {
    userId: string;
    characterId: string | null;
};

/**
 * Resolves the "acting" identity for a piece of content.
 * Every module's create/update handler should pass through here rather
 * than reading userId/characterId off the request body directly, so
 * validation (e.g. "does this user own this character?") lives in one place.
 */
export function resolveAuthor(userId: string, characterId?: string | null): Author {
    return {
        userId,
        characterId: characterId ?? null,
    };
}