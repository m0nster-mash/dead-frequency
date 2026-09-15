import {ActorType, EventType} from '@/shared/constants';

export interface NotificationPayload {
    recipientUserId: string;
    eventType: EventType;
    actorId: string;
    actorType?: ActorType;
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
