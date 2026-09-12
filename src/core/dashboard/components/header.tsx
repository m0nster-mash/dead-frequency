import {ThemeToggle} from "@/app/components/theme-toggle";
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import BellIcon from "@/shared/svg/bootstrap-bell-icon.svg";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import {JSX} from "react";

/**
 * An asynchronous Next.js Server Page component that renders the central top navigation toolbar.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the global application dashboard header element tree
 */
export default async function Header(): Promise<JSX.Element> {

    return (
        <header className={sidebarStyles.topbar}>
            <div className={sidebarStyles.topbarLeft}>
                <Breadcrumbs/>
            </div>

            <div className={sidebarStyles.topbarRight}>
                <ThemeToggle/>
                <button className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled} ${sidebarStyles.notificationButton}`} aria-label="Notifications">
                    <BellIcon/>
                    <span className={sidebarStyles.notificationDot}></span>
                </button>
            </div>
        </header>
    );
}
