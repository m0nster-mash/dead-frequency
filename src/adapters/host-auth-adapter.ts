import type {AvatarAuthAdapter} from "@/../packages/feature-avatar/src/contracts/auth";
import type {ChatboxAuthAdapter, ModuleUser} from "@/../packages/feature-chatbox/src/contracts/auth";
import type {ForumAuthAdapter} from "@/../packages/feature-forum/src/contracts/auth";
import {auth} from "@/core/auth";
import {headers} from "next/headers";

/**
 * Concrete host implementation of authentication adapters for feature modules.
 * Resolves current user sessions via BetterAuth and Next.js 15 request headers.
 */
export const hostAuthAdapter: ChatboxAuthAdapter & AvatarAuthAdapter & ForumAuthAdapter = {
    async getCurrentUser(): Promise<ModuleUser | null> {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return null;
        }

        return {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image ?? null,
            role: (session.user as { role?: string }).role ?? "user",
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
        return user?.role === "admin" || user?.role === "moderator";
    },
};
