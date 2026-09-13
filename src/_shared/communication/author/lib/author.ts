import {user} from "@/_core/auth/schema/auth.schema";
import {text} from "drizzle-orm/pg-core";

/**
 * Shared structural database column map configuration intended for horizontal embedding across content-bearing schemas.
 *
 * Design Architecture Rules:
 * - `userId`: Mandatory foreign key matching active primary profiles.
 * - `characterId`: Kept intentionally nullable to support progressive feature-proofing guidelines. It serves as a
 *                  reserved column slot to avoid widespread structural migrations once the Character System goes live.
 *
 * @property {text} userId - Non-nullable foreign key anchor linking content back to a primary account row with
 *                           cascading deletions.
 * @property {text} characterId - Reserved nullable text column tracking active roleplay or visual alias profiles.
 *
 * @example
 * export const forumPost = pgTable("forum_post", {
 *   id: text("id").primaryKey(),
 *   ...authorColumns,
 *   body: text("body").notNull(),
 * });
 */
export const authorColumns = {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    /**
     * No FK yet — the `character` table doesn't exist. Add the reference once the Character System schema lands;
     * until then this is just a nullable text column reserved for that id.
     */
    characterId: text("character_id"),
};

/**
 * Clean runtime data contract layer representing unified operational author metrics.
 *
 * @property {string} userId - The unique identifier of the posting user account.
 * @property {string | null} characterId - The identity map reference of the active display character alias, or null.
 */
export type Author = {
    userId: string;
    characterId: string | null;
};

/**
 * TODO:: implement character system
 *
 * Resolves the true "acting" identity parameters for a specific piece of platform content.
 *
 * Security Enforcement Rule: every module's create/update data modification handler should process fields through
 * this helper block rather than mapping attributes directly off untrusted request body parameters. This structural
 * separation ensures that downstream validation criteria (ex. confirming character alignment permissions) are
 * centrally guarded.
 *
 * @param {string} userId - The authenticated user identity key string pulled from verified session handlers.
 * @param {string | null} [characterId] - The raw untrusted alias identifier input captured from interface components.
 *
 * @returns {Author} A safe, normalized structural author profile contract object.
 */
export function resolveAuthor(userId: string, characterId?: string | null): Author {
    return {
        userId,
        characterId: characterId ?? null,
    };
}
