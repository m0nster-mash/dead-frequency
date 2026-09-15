import type {AvatarAuthAdapter} from "@/../packages/feature-avatar/src/contracts/auth";
import type {CharacterAuthAdapter, CharacterOwnerRef} from "@/../packages/feature-character/src/contracts/auth";
import type {ChatboxAuthAdapter, ModuleUser} from "@/../packages/feature-chatbox/src/contracts/auth";
import type {ForumAuthAdapter} from "@/../packages/feature-forum/src/contracts/auth";
import {requireSession} from "@/core/auth/lib/require-session";
import {UserRole} from "@shared/constants/user-role";

/**
 * Concrete host implementation of authentication adapters for feature modules.
 * Resolves current user sessions via BetterAuth and Next.js 15 request headers.
 */
export const hostAuthAdapter: ChatboxAuthAdapter &
    AvatarAuthAdapter &
    ForumAuthAdapter &
    CharacterAuthAdapter = {
    async getCurrentUser(): Promise<ModuleUser | null> {
        const session = await requireSession();

        return {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image ?? null,
            role: (session.user as { role?: string }).role ?? UserRole.USER,
        };
    },

    async canPostMessage(user: ModuleUser): Promise<boolean> {
        return Boolean(user?.id);
    },

    async canUpdateAvatar(user: ModuleUser): Promise<boolean> {
        return Boolean(user?.id);
    },

    async canCreateThread(user: ModuleUser): Promise<boolean> {
        return Boolean(user?.id);
    },

    async canCreatePost(user: ModuleUser): Promise<boolean> {
        return Boolean(user?.id);
    },

    async canModerateBoard(user: ModuleUser): Promise<boolean> {
        return user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;
    },

    async canCreateCharacter(user: ModuleUser): Promise<boolean> {
        return Boolean(user?.id);
    },

    async canEditCharacter(user: ModuleUser, character: CharacterOwnerRef): Promise<boolean> {
        return user?.id === character.ownerUserId;
    },

    async canDeleteCharacter(user: ModuleUser, character: CharacterOwnerRef): Promise<boolean> {
        return user?.id === character.ownerUserId;
    },
};
