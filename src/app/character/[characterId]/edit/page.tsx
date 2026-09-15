import {CharacterEditForm} from "@/../packages/feature-character/src/components/character-edit-form";
import {getCharacterById} from "@/../packages/feature-character/src/lib/queries";
import {handleDeleteCharacter, handleUpdateCharacter} from "@/adapters/character-create-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import {isModuleEnabled} from "@/shared/lib/modules";
import {MODULE_KEYS} from "@shared/constants/modules";
import {notFound} from "next/navigation";
import React from "react";

interface PageProps {
    params: Promise<{ characterId: string }>;
}

export default async function CharacterEditPage({params}: PageProps) {
    const enabled = await isModuleEnabled(MODULE_KEYS.CHARACTERS);
    if (!enabled) {
        notFound();
    }

    const session = await requireSession();
    const {characterId} = await params;
    const character = await getCharacterById(db, characterId);

    if (!character || character.deletedAt !== null) {
        notFound();
    }

    if (character.ownerUserId !== session.user.id) {
        throw new Error("Unauthorized: You do not own this character.");
    }

    return (
        <>
            <PageHeader eyebrow={"Character Profile"}
                        title={`Edit: ${character.name}`}
                        subtitle="Update character details or soft-delete."/>

            <MainContentPanel title={`${character.name}`}>
                <CharacterEditForm character={character}
                                   onUpdateAction={handleUpdateCharacter}
                                   onDeleteAction={handleDeleteCharacter}/>
            </MainContentPanel>
        </>
    );
}
