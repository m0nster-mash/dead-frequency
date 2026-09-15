import Link from "next/link";
import React from "react";
import characterStyle from "../styles/character.module.css";

interface CharacterProfileCardProps {
    character: {
        id: string;
        name: string;
        slug: string;
        ownerUserId: string;
        bio?: string | null;
        createdAt: Date;
    };
    isOwner?: boolean;
}

export function CharacterProfileCard({character, isOwner = false}: CharacterProfileCardProps) {
    return (
        <div className={characterStyle.card}>
            <div className={characterStyle.cardHeader}>
                <h3 className={characterStyle.cardTitle}>{character.name}</h3>
                {isOwner && (
                    <Link href={`/character/${character.id}/edit`}>
                        Edit Character
                    </Link>
                )}
            </div>

            <div>
                Owned by User ID: <Link href={`/user/${character.ownerUserId}`}>{character.ownerUserId}</Link>
            </div>

            {character.bio ? (
                <p className={characterStyle.bioText}>{character.bio}</p>
            ) : (
                <p className={characterStyle.emptyBio}>No character bio provided.</p>
            )}
        </div>
    );
}
