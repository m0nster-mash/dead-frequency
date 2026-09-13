import {ThemeToggle} from "@/app/components/theme-toggle";
import {auth} from "@/core/auth";
import Breadcrumbs from "@/core/dashboard/components/breadcrumbs";
import {ChatboxDropdown} from "@/feature/chatbox/components/chatbox-dropdown";
import {NotificationDropdown} from "@/shared/communication/notifications/components/notification-dropdown";
import sidebarStyles from "@shared/styles/patterns/sidebar.module.css";
import {headers} from "next/headers";
import {JSX} from "react";

/**
 * Renders the central top navigation toolbar.
 */
export default async function Header(): Promise<JSX.Element> {

    const session = await auth.api.getSession({headers: await headers()});
    const isAdmin = session?.user?.role === "admin";

    return (
        <header className={sidebarStyles.topbar}>
            <div className={sidebarStyles.topbarLeft}>
                <Breadcrumbs/>
            </div>

            <div className={sidebarStyles.topbarRight}>
                <ThemeToggle/>
                <NotificationDropdown />
                <ChatboxDropdown isAdmin={isAdmin}/>
            </div>
        </header>
    );
}
