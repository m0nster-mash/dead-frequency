import type {AvatarAuthAdapter} from "../contracts/auth";
import type {AvatarDataAdapter} from "../contracts/data";
import {AvatarConfig} from "./types";
import {validateAvatarConfig} from "./validation";

/**
 * Union response type mapping operation success boundaries for saving configurations.
 */
export type SaveAvatarConfigResult =
    | { success: true; config: AvatarConfig }
    | { success: false; error: string };

/**
 * Builds the package's avatar-saving action against host-provided adapters.
 * The package never imports a concrete auth or database implementation directly —
 * whoever hosts this package decides what those adapters actually do.
 */
export function createAvatarActions(
    authAdapter: AvatarAuthAdapter,
    dataAdapter: AvatarDataAdapter,
) {
    /**
     * Validates and persists an avatar configuration for the currently authenticated user.
     *
     * @param {unknown} input - Raw untrusted data payload captured from client components.
     *
     * @returns {Promise<SaveAvatarConfigResult>} A structured operation outcome.
     */
    async function saveAvatarConfig(input: unknown): Promise<SaveAvatarConfigResult> {
        const user = await authAdapter.getCurrentUser();

        if (!user) {
            return {success: false, error: "Not authenticated."};
        }

        const result = validateAvatarConfig(input);

        if (!result.valid) {
            return {success: false, error: result.error};
        }

        await dataAdapter.saveConfig(user.id, result.config);

        return {success: true, config: result.config};
    }

    return {saveAvatarConfig};
}
