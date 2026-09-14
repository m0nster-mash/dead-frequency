export const AccountStatus = {
    ACTIVE: "ACTIVE",
    MUTED: "MUTED",
    TIMED_OUT: "TIMED_OUT",
    SHADOWBANNED: "SHADOWBANNED",
    BANNED: "BANNED",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];
