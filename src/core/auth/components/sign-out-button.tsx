"use client";

import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";
import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@/shared/styles/dashboard.module.css";
import ExitIcon from "@/shared/svg/bootstrap-exit-icon.svg";

export function SignOutButton() {
    const router = useRouter();
    const {collapsed} = useSidebar();

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            className={`${styles.buttonSignOut}${collapsed ? ` ${styles.buttonSignOutCollapsed}` : ""}`}
            type="button"
            aria-label="Sign out"
            onClick={handleSignOut}>
            {collapsed ? <ExitIcon/> : "Sign out"}
        </button>
    );
}