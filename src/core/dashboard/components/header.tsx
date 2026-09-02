import BellIcon from "@/shared/svg/bootstrap-bell-icon.svg";
import {ThemeToggle} from "@/app/components/theme-toggle"
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import styles from "@shared/styles/dashboard.module.css";

export default async function Header() {

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