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

export const ROLE_PERMISSIONS: Record<UserRole, {name: string, description: string, bypassesCooldown: boolean}> = {
    [UserRole.ADMIN]: {name: "Administrator", description: "Full system access", bypassesCooldown: true},
    [UserRole.MODERATOR]: {name: "Moderator", description: "Content moderation capabilities", bypassesCooldown: true},
    [UserRole.USER]: {name: "User", description: "Standard user account", bypassesCooldown: false},
} as const;
