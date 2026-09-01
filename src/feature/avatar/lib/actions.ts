"use server";

import {headers} from "next/headers";
import {auth} from "@/core/auth";
import {db} from "@/shared/db/client";
import {avatarConfig} from "@/feature/avatar/schema/avatar.schema";
import {validateAvatarConfig} from "@/feature/avatar/lib/validation";
import {AvatarConfig} from "@/feature/avatar/lib/types";

export type SaveAvatarConfigResult =
    | { success: true; config: AvatarConfig }
    | { success: false; error: string };

export async function saveAvatarConfig(input: unknown): Promise<SaveAvatarConfigResult> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user) {
        return {success: false, error: "Not authenticated."};
    }

    const result = validateAvatarConfig(input);

    if (!result.valid) {
        return {success: false, error: result.error};
    }

    await db
        .insert(avatarConfig)
        .values({userId: session.user.id, config: result.config})
        .onConflictDoUpdate({
            target: avatarConfig.userId,
            set: {config: result.config},
        });

    return {success: true, config: result.config};
}

export async function getAvatarConfigForUser(userId: string): Promise<AvatarConfig | null> {
    const row = await db.query.avatarConfig.findFirst({
        where: (table, {eq}) => eq(table.userId, userId),
    });

    return row?.config ?? null;
}