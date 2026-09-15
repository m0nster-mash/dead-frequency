/**
 * Core system permission roles.
 */
export const USER_ROLES = ['admin', 'moderator', 'user'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const UserRole = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
} as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.MODERATOR]: 'Moderator',
    [UserRole.USER]: 'User'
};
