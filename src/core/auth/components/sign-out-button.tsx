"use client";

import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";
import styles from "@/shared/styles/dashboard.module.css";

export function SignOutButton() {
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <button className={styles.buttonSignOut} type="button" onClick={handleSignOut}>
            Sign out
        </button>
    );
}