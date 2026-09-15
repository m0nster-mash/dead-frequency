"use server";

import {createCharacter, deleteCharacter, updateCharacter} from "../../packages/feature-character/src/lib/actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {logAuditAction} from "@shared/communication/moderation/lib/audit-log";
import {db} from "@shared/db/client";
import {TargetModule} from "@shared/constants/target-module";
import {revalidatePath} from "next/cache";

export async function handleCreateCharacter(formData: FormData): Promise<void> {
    const session = await requireSession();
    const name = String(formData.get("name") || "").trim();
    const bio = String(formData.get("bio") || "").trim();

    const result = await createCharacter(db, session.user.id, {name, bio});

    await logAuditAction({
        actorUserId: session.user.id,
        targetUserId: session.user.id,
        targetModule: TargetModule.CHARACTER,
        targetRecordId: result.characterId,
        actionType: result.actionType,
        metadata: {name: result.name},
    });

    revalidatePath(`/user/${session.user.id}`);
    revalidatePath(`/character/${result.characterId}`);
}

export async function handleUpdateCharacter(formData: FormData): Promise<void> {
    const session = await requireSession();
    const characterId = String(formData.get("characterId") || "");
    const name = String(formData.get("name") || "").trim();
    const bio = String(formData.get("bio") || "").trim();

    const result = await updateCharacter(db, session.user.id, {characterId, name, bio});

    await logAuditAction({
        actorUserId: session.user.id,
        targetUserId: session.user.id,
        targetModule: TargetModule.CHARACTER,
        targetRecordId: result.characterId,
        actionType: result.actionType,
        metadata: {name: result.name},
    });

    revalidatePath(`/character/${result.characterId}`);
    revalidatePath(`/user/${session.user.id}`);
}

export async function handleDeleteCharacter(formData: FormData): Promise<void> {
    const session = await requireSession();
    const characterId = String(formData.get("characterId") || "");

    const result = await deleteCharacter(db, session.user.id, characterId);

    await logAuditAction({
        actorUserId: session.user.id,
        targetUserId: session.user.id,
        targetModule: TargetModule.CHARACTER,
        targetRecordId: result.characterId,
        actionType: result.actionType,
        metadata: {name: result.name},
    });

    revalidatePath(`/user/${session.user.id}`);
}
