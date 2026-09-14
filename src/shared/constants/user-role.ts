import {UserRole} from "@shared/constants/enums/user-role";

export const Role = UserRole;
export type Role = (typeof Role)[keyof typeof Role];

export const ROLE_PERMISSIONS = {
    [Role.ADMIN]: {name: "Administrator", description: "Full system access", bypassesCooldown: true},
    [Role.MODERATOR]: {name: "Moderator", description: "Content moderation capabilities", bypassesCooldown: true},
    [Role.USER]: {name: "User", description: "Standard user account", bypassesCooldown: false},
} as const;
