/**
 * User friendship states.
 */
export const FRIENDSHIP_STATUSES = ['PENDING', 'ACCEPTED'] as const;
export type FriendshipStatus = (typeof FRIENDSHIP_STATUSES)[number];

export const FriendshipStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
} as const;

export const FRIENDSHIP_STATUS_LABELS: Record<FriendshipStatus, string> = {
    [FriendshipStatus.PENDING]: 'Pending',
    [FriendshipStatus.ACCEPTED]: 'Accepted',
};
