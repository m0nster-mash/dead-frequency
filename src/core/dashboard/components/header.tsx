import {ThemeToggle} from "@/app/components/theme-toggle";
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import BellIcon from "@/shared/svg/bootstrap-bell-icon.svg";
// import styles from "@shared/styles/dashboard.module.css";
import styles from "@/shared/styles/form.module.css";
import {JSX} from "react";

/**
 * An asynchronous Next.js Server Page component that renders the central top navigation toolbar.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the global application dashboard header element tree
 */
export default async function Header(): Promise<JSX.Element> {

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
            </div>
        </header>
    );
}
