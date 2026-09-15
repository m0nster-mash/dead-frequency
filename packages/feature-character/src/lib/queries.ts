import { and, asc, count, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { character, characterProfile } from "../schema/character.schema";

/**
 * Fetches all active (non-deleted) characters owned by a given user, ordered oldest first.
 */
export async function getCharactersForUser(db: NodePgDatabase<Record<string, unknown>>, ownerUserId: string) {
    return db
        .select({
            id: character.id,
            ownerUserId: character.ownerUserId,
            name: character.name,
            slug: character.slug,
            createdAt: character.createdAt,
            updatedAt: character.updatedAt,
            bio: characterProfile.bio,
        })
        .from(character)
        .leftJoin(characterProfile, eq(characterProfile.characterId, character.id))
        .where(and(eq(character.ownerUserId, ownerUserId), isNull(character.deletedAt)))
        .orderBy(asc(character.createdAt));
}

/**
 * Returns the count of active (non-deleted) characters owned by a given user.
 */
export async function getCharacterCountForUser(db: NodePgDatabase<Record<string, unknown>>, ownerUserId: string): Promise<number> {
    const [result] = await db
        .select({ value: count() })
        .from(character)
        .where(and(eq(character.ownerUserId, ownerUserId), isNull(character.deletedAt)));

    return Number(result?.value ?? 0);
}

/**
 * Fetches a single character (including soft-deleted ones) alongside its profile bio.
 */
export async function getCharacterById(db: NodePgDatabase<Record<string, unknown>>, characterId: string) {
    const [row] = await db
        .select({
            id: character.id,
            ownerUserId: character.ownerUserId,
            name: character.name,
            slug: character.slug,
            createdAt: character.createdAt,
            updatedAt: character.updatedAt,
            deletedAt: character.deletedAt,
            bio: characterProfile.bio,
        })
        .from(character)
        .leftJoin(characterProfile, eq(characterProfile.characterId, character.id))
        .where(eq(character.id, characterId))
        .limit(1);

    return row ?? null;
}
