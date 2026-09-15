/**
 * Guild membership ranks and application statuses.
 */
export const GUILD_RANKS = ['OWNER', 'MODERATOR', 'MEMBER', 'BANNED'] as const;
export type GuildRank = (typeof GUILD_RANKS)[number];

export const GuildRank = {
    OWNER: 'OWNER',
    MODERATOR: 'MODERATOR',
    MEMBER: 'MEMBER',
    BANNED: 'BANNED',
} as const;

export const GUILD_RANK_LABELS: Record<GuildRank, string> = {
    [GuildRank.OWNER]: 'Guild Owner',
    [GuildRank.MODERATOR]: 'Guild Moderator',
    [GuildRank.MEMBER]: 'Member',
    [GuildRank.BANNED]: 'Banned Member',
};

export const GUILD_MEMBERSHIP_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type GuildMembershipStatus = (typeof GUILD_MEMBERSHIP_STATUSES)[number];

export const GuildMembershipStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export const GUILD_MEMBERSHIP_STATUS_LABELS: Record<GuildMembershipStatus, string> = {
    [GuildMembershipStatus.PENDING]: 'Pending Approval',
    [GuildMembershipStatus.APPROVED]: 'Approved',
    [GuildMembershipStatus.REJECTED]: 'Rejected',
};
