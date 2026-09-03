"use server";

import {auth} from "@/core/auth";
import {AvatarConfig} from "@/feature/avatar/lib/types";
import {validateAvatarConfig} from "@/feature/avatar/lib/validation";
import {avatarConfig} from "@/feature/avatar/schema/avatar.schema";
import {db} from "@/shared/db/client";
import {headers} from "next/headers";

/**
 * Union response type mapping operation success boundaries for saving configurations.
 */
export type SaveAvatarConfigResult =
    | { success: true; config: AvatarConfig }
    | { success: false; error: string };

/**
 * An asynchronous Next.js Server Action that securely processes and persists an avatar configuration layout.
 *
 * @param {unknown} input - Raw untrusted data payload captured from client components or form inputs.
 *
 * @returns {Promise<SaveAvatarConfigResult>} A structured operation outcome dictionary carrying updated configurations
 * or strings.
 */
export async function saveAvatarConfig(input: unknown): Promise<SaveAvatarConfigResult> {
    const session = await auth.api.getSession({headers: await headers()});

    // Authentication Guard: Deflect unauthenticated callers safely without throwing critical runtime errors
    if (!session?.user) {
        return {
            success: false,
            error: "Not authenticated."
        };
    }

    // Defensive Verification: Evaluates asset properties against type restrictions
    const result = validateAvatarConfig(input);

    if (!result.valid) {
        return {success: false, error: result.error};
    }

    await db
        .insert(avatarConfig)
        .values({userId: session.user.id, config: result.config})
        .onConflictDoUpdate({
            // Target Key constraint tracking unique singular relationships per row profile
            target: avatarConfig.userId,
            set: {config: result.config},
        });

    return {success: true, config: result.config};
}

/**
 * High-performance persistence fetch helper that isolates a single user's custom design configuration state.
 * Safe for server components; skips permission evaluation loops to allow public dashboard profile hydration.
 *
 * @param {string} userId - The unique user identification primary key string matching targeted accounts.
 *
 * @returns {Promise<AvatarConfig | null>} A promise resolving to the saved configuration parameters, or null if
 * custom fields are missing.
 */
export async function getAvatarConfigForUser(userId: string): Promise<AvatarConfig | null> {

    const row = await db.query.avatarConfig.findFirst({
        where: (table, {eq}) => eq(table.userId, userId),
    });

    // Fallback parsing engine returns null descriptors if users have not custom-built characters yet
    return row?.config ?? null;
}
