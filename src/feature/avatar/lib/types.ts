/**
 * The system-wide blueprint version signature for the avatar configuration model.
 * Enforces a strict literal type token used to coordinate backward-compatible schema migrations 
 * if newer graphic parameters or columns are introduced down the line.
 */
export const AVATAR_CONFIG_VERSION = 1 as const;

/**
 * Structural definition mapping a user's customized vector profile design metrics.
 * Combines structural version constraints with string identification keys matching asset indices.
 *
 * @property {1} version - The schema evolution iteration tracking value locked to the system constant.
 * @property {string} eyes - The unique identity map string referencing a specific eye variant layout asset.
 * @property {string} mouth - The unique identity map string referencing a specific mouth variant layout asset.
 * @property {string} hair - The unique identity map string referencing a specific hair variant layout asset.
 */
export type AvatarConfig = {
    version: typeof AVATAR_CONFIG_VERSION;
    eyes: string;
    mouth: string;
    hair: string;
};
