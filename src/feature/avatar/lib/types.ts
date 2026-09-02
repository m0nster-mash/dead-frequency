export const AVATAR_CONFIG_VERSION = 1 as const;

export type AvatarConfig = {
    version: typeof AVATAR_CONFIG_VERSION;
    eyes: string;
    mouth: string;
    hair: string;
};