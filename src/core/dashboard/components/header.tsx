import {ThemeToggle} from "@/app/components/theme-toggle";
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import {ChatboxDropdown} from "@/feature/chatbox/components/chatbox-dropdown";
import buttonStyles from "@shared/styles/buttons.module.css";
import sidebarStyles from "@shared/styles/patterns/sidebar.module.css";
import BellIcon from "@shared/svg/bootstrap-bell-icon.svg";
import {JSX} from "react";

/**
 * Renders the central top navigation toolbar.
 */
export default async function Header(): Promise<JSX.Element> {

    return (
        <header className={sidebarStyles.topbar}>
            <div className={sidebarStyles.topbarLeft}>
                <Breadcrumbs/>
            </div>

            <div className={sidebarStyles.topbarRight}>
                <ThemeToggle/>
                <button
                    className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled} ${sidebarStyles.notificationButton}`}
                    aria-label="Notifications">
                    <BellIcon/>
                    <span className={sidebarStyles.notificationDot}></span>
                </button>
                <ChatboxDropdown/>
            </div>
        </header>
    );
}
