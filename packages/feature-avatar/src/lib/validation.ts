import {AvatarPartCategory, isValidAvatarPart} from "./options";
import {AVATAR_CONFIG_VERSION, AvatarConfig} from "./types";


/**
 * Union response layout mapping defensive check boundaries across configuration inputs.
 */
export type AvatarConfigValidationResult =
    | { valid: true; config: AvatarConfig }
    | { valid: false; error: string };

/**
 * An explicit array trace containing structural category keys used to programmatically loop across fields.
 */
const PART_CATEGORIES: AvatarPartCategory[] = ["eyes", "mouth", "hair"];

/**
 * Validates untrusted input (ex. from a client request body) against the AvatarConfig shape. Rejects unknown part
 * IDs and enforces the version field.
 *
 * @param {unknown} input - Raw untrusted data payload captured from client components or API endpoints.
 *
 * @returns {AvatarConfigValidationResult} A structured validation result dictating correctness or descriptive error
 *                                         states.
 */
export function validateAvatarConfig(input: unknown): AvatarConfigValidationResult {
    // Step 1: Base Shape Verification
    if (typeof input !== "object" || input === null) {
        return {valid: false, error: "Avatar config must be an object."};
    }

    // Direct cast to record map facilitates safe parameter query tests
    const candidate = input as Record<string, unknown>;

    // Step 2: Enforce Blueprint Version Invariants
    if (candidate.version !== AVATAR_CONFIG_VERSION) {
        return {
            valid: false,
            error: `Avatar config version must be ${AVATAR_CONFIG_VERSION}.`,
        };
    }

    // Step 3: Sequential Key Analysis Loop
    for (const category of PART_CATEGORIES) {
        const value = candidate[category];

        // Drop validation tokens if fields hold boolean arrays or numerical properties
        if (typeof value !== "string") {
            return {valid: false, error: `Missing or invalid "${category}" field.`};
        }

        // Confirm codes map to actual verified vector options records
        if (!isValidAvatarPart(category, value)) {
            return {valid: false, error: `Unknown ${category} part id: "${value}".`};
        }
    }

    // Step 4: Secure Data Structuring Allocation
    return {
        valid: true,
        config: {
            version: AVATAR_CONFIG_VERSION,
            eyes: candidate.eyes as string,
            mouth: candidate.mouth as string,
            hair: candidate.hair as string,
        },
    };
}
