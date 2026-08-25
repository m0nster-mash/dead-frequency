"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@lib/auth-client";

export function SignOutButton() {
    const router = useRouter(0);

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <button type="button" onClick="handleSignOut">
			Sign Out
		</button>
    );
}