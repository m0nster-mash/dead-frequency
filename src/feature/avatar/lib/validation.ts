import {AVATAR_CONFIG_VERSION, AvatarConfig} from "@/feature/avatar/lib/types";
import {AvatarPartCategory, isValidAvatarPart} from "@/feature/avatar/lib/options";

export type AvatarConfigValidationResult =
    | { valid: true; config: AvatarConfig }
    | { valid: false; error: string };

const PART_CATEGORIES: AvatarPartCategory[] = ["eyes", "mouth", "background", "hair"];

/**
 * Validates untrusted input (e.g. from a client request body) against the
 * AvatarConfig shape. Rejects unknown part IDs and enforces the version field.
 * This keeps writes decoupled from raw client input per issue #64.
 */
export function validateAvatarConfig(input: unknown): AvatarConfigValidationResult {
    if (typeof input !== "object" || input === null) {
        return {valid: false, error: "Avatar config must be an object."};
    }

    const candidate = input as Record<string, unknown>;

    if (candidate.version !== AVATAR_CONFIG_VERSION) {
        return {
            valid: false,
            error: `Avatar config version must be ${AVATAR_CONFIG_VERSION}.`,
        };
    }

    for (const category of PART_CATEGORIES) {
        const value = candidate[category];

        if (typeof value !== "string") {
            return {valid: false, error: `Missing or invalid "${category}" field.`};
        }

        if (!isValidAvatarPart(category, value)) {
            return {valid: false, error: `Unknown ${category} part id: "${value}".`};
        }
    }

    return {
        valid: true,
        config: {
            version: AVATAR_CONFIG_VERSION,
            eyes: candidate.eyes as string,
            mouth: candidate.mouth as string,
            background: candidate.background as string,
            hair: candidate.hair as string,
        },
    };
}