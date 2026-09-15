export const CHARACTER_AUDIT_ACTIONS = [
    "CHARACTER_CREATED",
    "CHARACTER_EDITED",
    "CHARACTER_DELETED",
] as const;

export type CharacterAuditAction = (typeof CHARACTER_AUDIT_ACTIONS)[number];

export const CharacterAuditAction = {
    CHARACTER_CREATED: "CHARACTER_CREATED",
    CHARACTER_EDITED: "CHARACTER_EDITED",
    CHARACTER_DELETED: "CHARACTER_DELETED",
} as const;

/** Default maximum number of active characters allowed per user account */
export const MAX_CHARACTERS_PER_USER = 10;
