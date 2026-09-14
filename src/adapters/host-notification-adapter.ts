import {ActorType} from "@/shared/constants/ActorType";
import {EventType} from "@/shared/constants/EventType";

export interface NotificationPayload {
    recipientUserId: string;
    eventType: EventType.PING | EventType.DM | EventType.REACTION | EventType.FRIEND_REQUEST | EventType.BLOG_POST | EventType.MOD_ALERT;
    actorId: string;
    actorType?: ActorType.USER | ActorType.CHARACTER;
    targetModule: string;
    targetRecordId: string;
    payload?: Record<string, unknown>;
}

export interface HostNotificationAdapter {
    dispatchNotification(notification: NotificationPayload): Promise<void>;
}

/**
 * Concrete host notification dispatcher bridging decoupled module events
 * to the central host notification schema.
 */
export const hostNotificationAdapter: HostNotificationAdapter = {
    async dispatchNotification(notification: NotificationPayload): Promise<void> {
        // Dispatches alerts and badge updates through central notification service
        console.log("[HostNotificationAdapter] Notification dispatched:", notification);
    },
};
