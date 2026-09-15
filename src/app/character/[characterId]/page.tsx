import {CharacterProfileCard} from "@/../packages/feature-character/src/components/character-profile-card";
import {getCharacterById} from "@/../packages/feature-character/src/lib/queries";
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

export default async function CharacterProfilePage({params}: PageProps) {
    const enabled = await isModuleEnabled(MODULE_KEYS.CHARACTERS);
    if (!enabled) {
        notFound();
    }

    const {characterId} = await params;
    const character = await getCharacterById(db, characterId);

    if (!character || character.deletedAt !== null) {
        notFound();
    }

    const session = await requireSession().catch(() => null);
    const isOwner = session?.user?.id === character.ownerUserId;

    return (
        <>
            <PageHeader eyebrow={"Character Profile"}
                        title={character.name}
                        subtitle="Character Profile Overview"/>

            <MainContentPanel title={`${character.name}`}>
                <CharacterProfileCard character={character}
                                      isOwner={isOwner}/>
            </MainContentPanel>
        </>
    );
}
