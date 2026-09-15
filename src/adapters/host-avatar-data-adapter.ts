import type {AvatarConfig} from "@/../packages/feature-avatar/src/lib/types";
import type {AvatarDataAdapter} from "@/../packages/feature-avatar/src/contracts/data";
import {avatar} from "@/../packages/feature-avatar/src/schema/avatar.schema";
import {db} from "@/shared/db/client";
import {eq} from "drizzle-orm";

/**
 * Concrete host implementation of the avatar package's data port.
 * Resolves persistence via the shared Drizzle client and the avatar package's own schema.
 */
export const hostAvatarDataAdapter: AvatarDataAdapter = {
    async saveConfig(ownerId, config) {
        await db
            .insert(avatar)
            .values({
                id: `avatar_${ownerId}`,
                userId: ownerId,
                // NOTE: avatar.schema.ts's layerConfig type ({base, eyes, hair, mouth} strings) doesn't
                // match AvatarConfig ({version: 1, eyes, mouth, hair}) used everywhere else in the
                // package. Casting here as a stopgap until you decide whether to update the schema's
                // shape or keep translating at this boundary permanently.
                layerConfig: config as unknown as Record<string, string>,
            })
            .onConflictDoUpdate({
                target: avatar.userId,
                set: {
                    layerConfig: config as unknown as Record<string, string>,
                    updatedAt: new Date(),
                },
            });
    },
};

/**
 * Host-side read helper. Not part of the package's own contract — per your call, reads stay
 * entirely host-side, so this lives next to the adapter rather than being injected into the package.
 */
export async function getAvatarConfigForUser(userId: string): Promise<AvatarConfig | null> {
    const [row] = await db
        .select({layerConfig: avatar.layerConfig})
        .from(avatar)
        .where(eq(avatar.userId, userId))
        .limit(1);

    return (row?.layerConfig as AvatarConfig | undefined) ?? null;
}
