'use server';

import {SYSTEM_MODULES_METADATA, SystemModuleKey} from '@/shared/constants/modules';
import {db} from "@shared/db/client";
import {systemModules} from "@shared/db/system-modules";
import {eq} from 'drizzle-orm';
import {revalidatePath} from 'next/cache';

/**
 * Retrieves current toggle states for all system modules.
 */
export async function getModuleStatesAction(): Promise<Record<SystemModuleKey, boolean>> {
    try {
        const records = await db.select().from(systemModules);

        const states: Record<string, boolean> = {};
        Object.keys(SYSTEM_MODULES_METADATA).forEach((key) => {
            states[key] = SYSTEM_MODULES_METADATA[key as SystemModuleKey].defaultEnabled;
        });

        records.forEach((record) => {
            states[record.key] = record.isEnabled;
        });

        return states as Record<SystemModuleKey, boolean>;
    } catch (error) {
        console.error('Error fetching module states:', error);

        const defaults: Record<string, boolean> = {};
        Object.keys(SYSTEM_MODULES_METADATA).forEach((key) => {
            defaults[key] = SYSTEM_MODULES_METADATA[key as SystemModuleKey].defaultEnabled;
        });
        return defaults as Record<SystemModuleKey, boolean>;
    }
}

/**
 * Toggles a module's enabled status in the database.
 * Uses array destructuring on Drizzle responses.
 */
export async function toggleModuleStateAction(
    moduleKey: SystemModuleKey,
    isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        const [existingRecord] = await db
            .select()
            .from(systemModules)
            .where(eq(systemModules.key, moduleKey))
            .limit(1);

        if (existingRecord) {
            await db
                .update(systemModules)
                .set({isEnabled, updatedAt: new Date()})
                .where(eq(systemModules.key, moduleKey));
        } else {
            await db.insert(systemModules).values({
                key: moduleKey,
                isEnabled,
                updatedAt: new Date(),
            });
        }

        revalidatePath('/admin');
        revalidatePath('/admin/modules');

        return {success: true};
    } catch (error) {
        console.error(`Failed to update module state for ${moduleKey}:`, error);
        return {success: false, error: 'Failed to update module status.'};
    }
}
