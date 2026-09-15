import {CharacterCreateForm} from "@/../packages/feature-character/src/components/character-create-form";
import {getCharacterCountForUser} from "@/../packages/feature-character/src/lib/queries";
import {handleCreateCharacter} from "@/adapters/character-create-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import {isModuleEnabled} from "@/shared/lib/modules";
import {MODULE_KEYS} from "@shared/constants/modules";
import {notFound} from "next/navigation";
import React from "react";

export default async function CharacterCreatePage() {
    const enabled = await isModuleEnabled(MODULE_KEYS.CHARACTERS);
    if (!enabled) {
        notFound();
    }

    const session = await requireSession();
    const currentCount = await getCharacterCountForUser(db, session.user.id);

    return (
        <>
            <PageHeader eyebrow={"Character Profile"}
                        title="Create Character"
                        subtitle="Add a new roleplay persona to your account."/>

            <MainContentPanel title={"Create new character"}>
                <CharacterCreateForm currentCount={currentCount}
                                     onSubmitAction={handleCreateCharacter}/>
            </MainContentPanel>
        </>
    );
}
