import { auth } from "@/core/auth";
import { headers } from "next/headers";
import type { HostAuthAdapter, HostModuleUser } from "@/core/auth/contracts/auth-adapter.contract";

export const hostChatboxAuthAdapter: HostAuthAdapter = {
    async getCurrentUser(): Promise<HostModuleUser | null> {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) return null;

        return {
            id: session.user.id,
            name: session.user.name ?? "Anonymous User",
            email: session.user.email,
            avatarUrl: session.user.image ?? undefined,
            role: session.user.role ?? "user",
        };
    },

    async hasPermission(user: HostModuleUser, action: string): Promise<boolean> {
        if (action === "post_message") return user.role !== "banned";
        return true;
    },
};
