"use server";

import {requireSession} from "@/core/auth/lib/require-session";
import {moduleEnum} from "@/shared/communication/moderation/schema/moderation.schema";
import {setPostingStatus} from "@/shared/communication/status/lib/status";

/**
 * Server action that modifies a user's posting standing or restriction states.
 *
 * @param {FormData} formData - The payload containing the form inputs submitted from the client side.
 *
 * @throws {Error} Throws a `"Forbidden"` error if the active user session is missing or lacks an `"admin"` role
 *                 signature.
 *
 * @returns {Promise<void>} A promise resolving once structural updates are successfully applied.
 */
export async function applyPostingStatusAction(formData: FormData): Promise<void> {
    const session = await requireSession({role: "admin"});
    const userId = String(formData.get("userId"));
    const moduleValue = String(formData.get("module") || "");
    const status = String(formData.get("status")) as "active" | "muted" | "shadowbanned" | "banned";
    const reason = String(formData.get("reason") || "") || undefined;

    // dispatches fields down to the underlying database driver query configuration layer
    await setPostingStatus({
        userId,
        /**
         * converts empty string parameters down into clean `null` markers to explicitly indicate a site-wide ban
         * configuration across all feature blocks.
         */
        module: moduleValue ? (moduleValue as (typeof moduleEnum.enumValues)[number] | null) : null,
        status,
        moderatorId: session.user.id, // binds the active admin's ID to satisfy system tracing hooks
        reason,
    });
}
