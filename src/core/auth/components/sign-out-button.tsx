"use client";

import {authClient} from "@/core/auth/lib/auth-client";
import {useSidebar} from "@/core/dashboard/components/navigation/sidebar-context";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import ExitIcon from "@/shared/svg/bootstrap-exit-icon.svg";
import {useRouter} from "next/navigation";
import {JSX} from "react";

/**
 * An interactive Client Component button that handles user session termination and secure context exit routing.
 */
export function SignOutButton(): JSX.Element {
    const router = useRouter();
    const {collapsed} = useSidebar();

    /**
     * Executes security teardown workflows on the authorization layer client. Clears access credentials and updates
     * routing anchors securely.
     */
    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            className={`${sidebarStyles.buttonSignOut}${collapsed ? ` ${sidebarStyles.buttonSignOutCollapsed}` : ""}`}
            type="button"
            aria-label="Sign out"
            onClick={handleSignOut}>
            {collapsed ? <ExitIcon/> : "Sign out"}
        </button>
    );
}
