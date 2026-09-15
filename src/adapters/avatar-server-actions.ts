"use server";

import {createAvatarActions, SaveAvatarConfigResult} from "@/../packages/feature-avatar/src/lib/actions";
import {hostAuthAdapter} from "./host-auth-adapter";
import {hostAvatarDataAdapter} from "./host-avatar-data-adapter";

/**
 * Binds the avatar package's action factory to this host's concrete adapters, exposed as a
 * genuine Next.js Server Action. Server Actions are the one function type the App Router allows
 * to be handed from a Server Component into a Client Component's props — an ordinary closure
 * built by calling createAvatarActions() directly inside a Server Component would not qualify.
 */
const {saveAvatarConfig: boundSaveAvatarConfig} = createAvatarActions(
    hostAuthAdapter,
    hostAvatarDataAdapter,
);

export async function saveAvatarConfigAction(input: unknown): Promise<SaveAvatarConfigResult> {
    return boundSaveAvatarConfig(input);
}
