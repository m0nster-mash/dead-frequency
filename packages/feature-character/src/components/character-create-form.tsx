"use client";

import React, {useTransition} from "react";
import {MAX_CHARACTERS_PER_USER} from "../lib/constants";
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
        if (isLimitReached) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            await onSubmitAction(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={characterStyle.counterBadge}>
                Characters Created: <strong>{currentCount} / {MAX_CHARACTERS_PER_USER}</strong>
            </div>

            {isLimitReached && (
                <div className={characterStyle.limitWarning}>
                    You have reached the maximum character limit ({MAX_CHARACTERS_PER_USER}). Please delete an existing
                    character before creating a new one.
                </div>
            )}

            <div>
                <label htmlFor="name">Character Name *</label>
                <input id="name"
                       name="name"
                       type="text"
                       required
                       disabled={isPending || isLimitReached}/>
            </div>

            <div>
                <label htmlFor="bio">Description / Bio</label>
                <textarea id="bio"
                          name="bio"
                          disabled={isPending || isLimitReached}/>
            </div>

            <div>
                <button type="submit" disabled={isPending || isLimitReached}>
                    {isPending ? "Creating..." : "Create Character"}
                </button>
            </div>
        </form>
    );
}
