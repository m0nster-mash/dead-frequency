import {randomUUID} from "crypto";
import {notification} from "@/_shared/communication/notifications/schema/notifications.schema";
import {db} from "@/_shared/db/client";

/**
 * Structural payload contract mapping properties required to dispatch a notification. Extracts legal type string
 * variants dynamically straight from the underlying schema enum definition arrays.
 *
 * @property {string} userId - The unique identifier of the target user profile receiving the alert message.
 * @property {(typeof notification.type.enumValues)[number]} type - The category classification tracking the
 *                                                                  notification subclass (ex. "reply", "mention").
 * @property {Record<string, unknown>} [payload={}] - Optional unstructured data bucket storing link targets, route
 *                                                    hashes, or localized fragment markers.
 */
type NotifyInput = {
    userId: string;
    type: (typeof notification.type.enumValues)[number];
    payload?: Record<string, unknown>;
};

/**
 * Single system-wide dispatch entry point for pushing alerts and events to platform members. Never write directly to
 * the notifications table from feature blocks. Always route mutations through here to shield core system features
 * from signature modifications.
 *
 * This decoupled wrapper layer isolates persistence tasks from communication channels. Once production requirements
 * demand real-time streaming layers (ex. WebSockets or SSE cascades), those fan-out scripts can be appended straight
 * into this method block without breaking feature code.
 *
 * @param {NotifyInput} input - Structured event properties submitted by system code paths or action scripts.
 *
 * @returns {Promise<void>} A promise resolving once the logging row transaction commits successfully to storage.
 */
export async function notify(input: NotifyInput): Promise<void> {
    // Persists notification records securely using isolated parameter formatting layouts
    await db.insert(notification).values({
        id: randomUUID(), // Generates an immutable tracking index mapping the logging row entry
        userId: input.userId,
        type: input.type,
        /**
         * Uses nullish coalescing configurations to explicitly force undefined optional parameters into empty object
         * indices, ensuring standardized jsonb structures.
         */
        payload: input.payload ?? {},
    });

    // TODO:: Append real-time push events engine hooks (ex. io.to(userId).emit("notification")) here
}
