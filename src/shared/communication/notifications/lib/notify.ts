import {randomUUID} from "crypto";
import {notification} from "@shared/communication/notifications/schema/notifications.schema";
import {db} from "@shared/db/client";

type NotifyInput = {
    userId: string;
    type: (typeof notification.type.enumValues)[number];
    payload?: Record<string, unknown>;
};

/**
 * Single dispatch point. Later this can fan out to real-time push
 * (websocket event) in addition to the DB row — callers don't need to
 * change when that lands.
 */
export async function notify(input: NotifyInput) {
    await db.insert(notification).values({
        id: randomUUID(),
        userId: input.userId,
        type: input.type,
        payload: input.payload ?? {},
    });
}
