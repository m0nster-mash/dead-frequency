/**
 * Valid isolated feature component categories supported by the vector customization system.
 */
export type AvatarPartCategory = "eyes" | "mouth" | "hair";

/**
 * Structural definition of a single selectable design feature option asset.
 *
 * @property {string} id - The specific unique string reference matching an SVG component variant.
 * @property {string} label - Readable display text name rendered across user selection menus.
 */
export type AvatarOption = {
    id: string;
    label: string;
};

/**
 * Registry array mapping out the available eyes customization asset presets.
 */
export const EYES_OPTIONS: AvatarOption[] = [
    {id: "eyes-01", label: "Blue"},
    {id: "eyes-02", label: "Green"}
];

/**
 * Registry array mapping out the available mouth customization asset presets.
 */
export const MOUTH_OPTIONS: AvatarOption[] = [
    {id: "mouth-01", label: "Smile"},
    {id: "mouth-02", label: "Frown"}
];

/**
 * Registry array mapping out the available hair customization asset presets.
 */
export const HAIR_OPTIONS: AvatarOption[] = [
    {id: "hair-01", label: "Brown"},
    {id: "hair-02", label: "Black"}
];

/**
 * Central dictionary aggregating all operational feature category asset menus.
 * Drives validation layers and interactive studio selection loop arrays.
 *
 * @type {Record<AvatarPartCategory, AvatarOption[]>}
 */
export const AVATAR_OPTIONS: Record<AvatarPartCategory, AvatarOption[]> = {
    eyes: EYES_OPTIONS,
    mouth: MOUTH_OPTIONS,
    hair: HAIR_OPTIONS
};

/**
 * Defensive query verification helper that determines if a specific asset id exists within the legal bounds of its
 * requested design category. Used by schema validators to shield database inputs from foreign string injections.
 *
 * @param {AvatarPartCategory} category - The design feature scope to cross-check (ex. "eyes").
 * @param {string} id - The untrusted asset variant identifier being tested.
 *
 * @returns {boolean} True if the item identity matches an entry in the legal option matrix.
 */
export function isValidAvatarPart(category: AvatarPartCategory, id: string): boolean {
    return AVATAR_OPTIONS[category].some((option) => option.id === id);
}

/**
 * Baseline visual initialization model used to configure new platform accounts on their first paint cycle.
 * Locks defaults to use the first recorded index entry of each standalone options array pool.
 */
export const DEFAULT_AVATAR_CONFIG = {
    version: 1 as const, // Constant version signature ensuring backward compatibility for asset migrations
    eyes: EYES_OPTIONS[0].id,
    mouth: MOUTH_OPTIONS[0].id,
    hair: HAIR_OPTIONS[0].id
};
