import type {AvatarDataAdapter} from "@/../packages/feature-avatar/src/contracts/data";
import type {AvatarConfig} from "@/../packages/feature-avatar/src/lib/types";
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
                layerConfig: config,
            })
            .onConflictDoUpdate({
                target: avatar.userId,
                set: {
                    layerConfig: config,
                    updatedAt: new Date(),
                },
            });
    },
};

/**
 * Host-side read helper. Reads stay entirely host-side (not part of the package's contract),
 * so this lives next to the adapter rather than being injected into the package.
 */
export async function getAvatarConfigForUser(userId: string): Promise<AvatarConfig | null> {
    const [row] = await db
        .select({layerConfig: avatar.layerConfig})
        .from(avatar)
        .where(eq(avatar.userId, userId))
        .limit(1);

    return row?.layerConfig ?? null;
}
