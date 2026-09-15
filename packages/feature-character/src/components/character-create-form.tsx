"use client";

import {MAX_CHARACTERS_PER_USER} from "../lib/constants";
import React, {useTransition} from "react";
import characterStyle from "../styles/character.module.css";

interface CharacterCreateFormProps {
    currentCount: number;
    onSubmitAction: (formData: FormData) => Promise<void>;
}

export function CharacterCreateForm({currentCount, onSubmitAction}: CharacterCreateFormProps) {
    const [isPending, startTransition] = useTransition();
    const isLimitReached = currentCount >= MAX_CHARACTERS_PER_USER;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLimitReached) return;

        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            await onSubmitAction(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit} className={characterStyle.container}>
            <div className={characterStyle.counterBadge}>
                Characters Created: <strong>{currentCount} / {MAX_CHARACTERS_PER_USER}</strong>
            </div>

            {isLimitReached && (
                <div className={characterStyle.limitWarning}>
                    You have reached the maximum character limit ({MAX_CHARACTERS_PER_USER}). Please delete an existing
                    character before creating a new one.
                </div>
            )}

            <div className={characterStyle.formGroup}>
                <label htmlFor="name" className={characterStyle.label}>Character Name *</label>
                <input id="name"
                       name="name"
                       type="text"
                       required
                       disabled={isPending || isLimitReached}
                       className={characterStyle.input}
                       placeholder="e.g. Sir Gareth the Brave"/>
            </div>

            <div className={characterStyle.formGroup}>
                <label htmlFor="bio" className={characterStyle.label}>Description / Bio</label>
                <textarea id="bio"
                          name="bio"
                          disabled={isPending || isLimitReached}
                          className={characterStyle.textarea}
                          placeholder="Describe your character's backstory, physical features, personality, etc."/>
            </div>

            <div className={characterStyle.actionsRow}>
                <button type="submit"
                        disabled={isPending || isLimitReached}
                        className={characterStyle.submitBtn}>
                    {isPending ? "Creating..." : "Create Character"}
                </button>
            </div>
        </form>
    );
}
