export type AvatarPartCategory = "eyes" | "mouth" | "background";

export type AvatarOption = {
    id: string;
    label: string;
};

export const EYES_OPTIONS: AvatarOption[] = [
    {id: "eyes-01", label: "Blue"},
    {id: "eyes-02", label: "Green"}
];

export const MOUTH_OPTIONS: AvatarOption[] = [
    {id: "mouth-01", label: "Smile"},
    {id: "mouth-02", label: "Frown"}
];

export const BACKGROUND_OPTIONS: AvatarOption[] = [
    {id: "background-01", label: "Forest"},
    {id: "background-02", label: "Space"}
];

export const AVATAR_OPTIONS: Record<AvatarPartCategory, AvatarOption[]> = {
    eyes: EYES_OPTIONS,
    mouth: MOUTH_OPTIONS,
    background: BACKGROUND_OPTIONS,
};

export function isValidAvatarPart(category: AvatarPartCategory, id: string): boolean {
    return AVATAR_OPTIONS[category].some((option) => option.id === id);
}

export const DEFAULT_AVATAR_CONFIG = {
    version: 1 as const,
    eyes: EYES_OPTIONS[0].id,
    mouth: MOUTH_OPTIONS[0].id,
    background: BACKGROUND_OPTIONS[0].id,
};