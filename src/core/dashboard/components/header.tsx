import {headers} from "next/headers";
import {auth} from "@core/auth";
import BellIcon from "@/shared/svg/bootstrap-bell-icon.svg";
import {ThemeToggle} from "@/app/components/theme-toggle"
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import styles from "@shared/styles/dashboard.module.css";

export default async function Header() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "?";

    return (
        <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
                <Breadcrumbs/>
            </div>
            <div className={styles.topbarRight}>
                <ThemeToggle/>
                <button className={`${styles.iconButton} ${styles.notificationButton}`} aria-label="Notifications">
                    <BellIcon/>
                    <span className={styles.notificationDot}></span>
                </button>
                <div className={styles.top}>{initials}</div>
            </div>
        </header>
    );
}