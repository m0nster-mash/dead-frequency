import {_themeToggle} from "@/_app/components/_theme-toggle";
import {auth} from "@/_core/auth";
import _breadcrumbs from "@/_core/dashboard/components/_breadcrumbs";
import {ChatboxDropdown} from "@/_feature/chatbox/components/chatbox-dropdown";
import {NotificationDropdown} from "@/_shared/communication/notifications/components/notification-dropdown";
import sidebarStyles from "@/_shared/styles/patterns/sidebar.module.css";
import {headers} from "next/headers";
import {JSX} from "react";

/**
 * Renders the central top navigation toolbar.
 */
export default async function _header(): Promise<JSX.Element> {

    const session = await auth.api.getSession({headers: await headers()});
    const isAdmin = session?.user?.role === "admin";

    return (
        <header className={sidebarStyles.topbar}>
            <div className={sidebarStyles.topbarLeft}>
                <_breadcrumbs/>
            </div>

            <div className={sidebarStyles.topbarRight}>
                <_themeToggle/>
                <NotificationDropdown/>
                <ChatboxDropdown isAdmin={isAdmin}/>
            </div>
        </header>
    );
}
