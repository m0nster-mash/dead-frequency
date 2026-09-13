"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import {authClient} from "@/core/auth/lib/auth-client";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import ExitIcon from "@/shared/svg/bootstrap-exit-icon.svg";
import {useRouter} from "next/navigation";
import {JSX} from "react";

/**
 * An interactive Client Component button that handles user session termination and secure context exit routing.
 *
 * @returns {JSX.Element} The visual sign-out action control button layer.
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

        // forces visitor redirection out of secure workspace spaces
        router.push("/login");

        // reconstruct active state hierarchies, ensuring a fresh server-side evaluation
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
