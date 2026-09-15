/**
 * User account standing and moderation states.
 */
export const ACCOUNT_STATUSES = ['ACTIVE', 'MUTED', 'TIMED_OUT', 'BANNED'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const AccountStatus = {
    ACTIVE: 'ACTIVE',
    MUTED: 'MUTED',
    TIMED_OUT: 'TIMED_OUT',
    BANNED: 'BANNED',
} as const;

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'Active',
    [AccountStatus.MUTED]: 'Muted',
    [AccountStatus.TIMED_OUT]: 'Timed Out',
    [AccountStatus.BANNED]: 'Banned',
};
