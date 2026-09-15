import {character, characterProfile} from "../schema/character.schema";
import {eq} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {CharacterAuditAction, MAX_CHARACTERS_PER_USER} from "./constants";
import {getCharacterCountForUser} from "./queries";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export async function requireOwnedCharacter(db: NodePgDatabase<Record<string, unknown>>, characterId: string, userId: string) {
    const [existing] = await db
        .select({id: character.id, ownerUserId: character.ownerUserId, name: character.name})
        .from(character)
        .where(eq(character.id, characterId))
        .limit(1);

    if (!existing) {
        throw new Error("Character not found.");
    }

    if (existing.ownerUserId !== userId) {
        throw new Error("You do not own this character.");
    }

    return existing;
}

export async function createCharacter(
    db: NodePgDatabase<Record<string, unknown>>,
    ownerUserId: string,
    data: { name: string; bio?: string }
): Promise<{ characterId: string; name: string; actionType: string }> {
    const name = data.name.trim();
    const bio = (data.bio || "").trim();

    if (!name) {
        throw new Error("Character name is required.");
    }

    const currentCount = await getCharacterCountForUser(db, ownerUserId);
    if (currentCount >= MAX_CHARACTERS_PER_USER) {
        throw new Error(`Character limit reached. You cannot create more than ${MAX_CHARACTERS_PER_USER} characters.`);
    }

    const characterId = crypto.randomUUID();
    const now = new Date();

    await db.insert(character).values({
        id: characterId,
        ownerUserId,
        name,
        slug: slugify(name) || characterId,
        createdAt: now,
        updatedAt: now,
    });

    await db.insert(characterProfile).values({
        id: crypto.randomUUID(),
        characterId,
        bio: bio || null,
        updatedAt: now,
    });

    return {
        characterId,
        name,
        actionType: CharacterAuditAction.CHARACTER_CREATED,
    };
}

export async function updateCharacter(
    db: NodePgDatabase<Record<string, unknown>>,
    ownerUserId: string,
    data: { characterId: string; name: string; bio?: string }
): Promise<{ characterId: string; name: string; actionType: string }> {
    const characterId = data.characterId;
    const name = data.name.trim();
    const bio = (data.bio || "").trim();

    if (!name) {
        throw new Error("Character name is required.");
    }

    await requireOwnedCharacter(db, characterId, ownerUserId);

    const now = new Date();

    await db
        .update(character)
        .set({name, updatedAt: now})
        .where(eq(character.id, characterId));

    await db
        .update(characterProfile)
        .set({bio: bio || null, updatedAt: now})
        .where(eq(characterProfile.characterId, characterId));

    return {
        characterId,
        name,
        actionType: CharacterAuditAction.CHARACTER_EDITED,
    };
}

export async function deleteCharacter(
    db: NodePgDatabase<Record<string, unknown>>,
    ownerUserId: string,
    characterId: string
): Promise<{ characterId: string; name: string; actionType: string }> {
    const existing = await requireOwnedCharacter(db, characterId, ownerUserId);

    await db
        .update(character)
        .set({deletedAt: new Date()})
        .where(eq(character.id, characterId));

    return {
        characterId,
        name: existing.name,
        actionType: CharacterAuditAction.CHARACTER_DELETED,
    };
}
