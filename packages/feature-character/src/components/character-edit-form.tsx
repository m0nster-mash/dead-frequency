"use client";

import React, {useTransition} from "react";
import characterStyle from "../styles/character.module.css";

interface CharacterEditFormProps {
    character: {
        id: string;
        name: string;
        bio: string | null;
    };
    onUpdateAction: (formData: FormData) => Promise<void>;
    onDeleteAction: (formData: FormData) => Promise<void>;
}

export function CharacterEditForm({character, onUpdateAction, onDeleteAction}: CharacterEditFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append("characterId", character.id);

        startTransition(async () => {
            await onUpdateAction(formData);
        });
    };

    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete "${character.name}"? This action can be undone by staff.`)) {
            return;
        }

        const formData = new FormData();
        formData.append("characterId", character.id);

        startTransition(async () => {
            await onDeleteAction(formData);
        });
    };

    return (
        <div className={characterStyle.container}>
            <form onSubmit={handleUpdate} className={characterStyle.container}>
                <div className={characterStyle.formGroup}>
                    <label htmlFor="name" className={characterStyle.label}>Character Name *</label>
                    <input id="name"
                           name="name"
                           type="text"
                           defaultValue={character.name}
                           required
                           disabled={isPending}
                           className={characterStyle.input}/>
                </div>

                <div className={characterStyle.formGroup}>
                    <label htmlFor="bio" className={characterStyle.label}>Description / Bio</label>
                    <textarea id="bio"
                              name="bio"
                              defaultValue={character.bio || ""}
                              disabled={isPending}
                              className={characterStyle.textarea}/>
                </div>

                <div className={characterStyle.actionsRow}>
                    <button type="submit" disabled={isPending} className={characterStyle.submitBtn}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className={characterStyle.deleteBtn}>
                        Delete Character
                    </button>
                </div>
            </form>
        </div>
    );
}
