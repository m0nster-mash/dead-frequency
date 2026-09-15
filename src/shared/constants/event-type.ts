/**
 * Notification trigger events across social and moderation sub-systems.
 */
export const EVENT_TYPES = [
    'PING',
    'DM',
    'REACTION',
    'FRIEND_REQUEST',
    'BLOG_POST',
    'MOD_ALERT',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EventType = {
    PING: 'PING',
    DM: 'DM',
    REACTION: 'REACTION',
    FRIEND_REQUEST: 'FRIEND_REQUEST',
    BLOG_POST: 'BLOG_POST',
    MOD_ALERT: 'MOD_ALERT',
} as const;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    [EventType.PING]: 'Mention / Ping',
    [EventType.DM]: 'Direct Message',
    [EventType.REACTION]: 'Reaction',
    [EventType.FRIEND_REQUEST]: 'Friend Request',
    [EventType.BLOG_POST]: 'New Blog Post',
    [EventType.MOD_ALERT]: 'Moderation Alert',
};
