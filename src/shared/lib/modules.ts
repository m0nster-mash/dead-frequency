import {SYSTEM_MODULES_METADATA, SystemModuleKey} from '@/shared/constants/modules';
import {db} from "@shared/db/client";
import {systemModules} from "@shared/db/system-modules";

import {eq} from 'drizzle-orm';

/**
 * Checks whether a given system module is currently enabled in the database.
 * Destructures Drizzle array query output per guidelines.
 */
export async function isModuleEnabled(moduleKey: SystemModuleKey): Promise<boolean> {
    try {
        const [moduleRecord] = await db
            .select({isEnabled: systemModules.isEnabled})
            .from(systemModules)
            .where(eq(systemModules.key, moduleKey))
            .limit(1);

        if (!moduleRecord) {
            return SYSTEM_MODULES_METADATA[moduleKey]?.defaultEnabled ?? true;
        }

        return moduleRecord.isEnabled;
    } catch (error) {
        console.error(`Failed to verify module status for '${moduleKey}':`, error);
        return SYSTEM_MODULES_METADATA[moduleKey]?.defaultEnabled ?? true;
    }
}
