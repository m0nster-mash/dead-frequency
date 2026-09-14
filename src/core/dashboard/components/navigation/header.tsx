import {ThemeToggle} from "@/app/components/theme-toggle";
import {auth} from "@/core/auth";
import Breadcrumbs from "@/core/dashboard/components/navigation/breadcrumbs";
// import {NotificationDropdown} from "@shared/communication/notification/components/notification-dropdown";
import sidebarStyles from "@shared/styles/patterns/sidebar.module.css";
import {headers} from "next/headers";
import {JSX} from "react";
// import {ChatboxDropdown} from "../../../../../packages/feature-chatbox/src/components/chatbox-dropdown";

/**
 * Renders the central top navigation toolbar.
 */
export default async function Header(): Promise<JSX.Element> {

    const session = await auth.api.getSession({headers: await headers()});
    // const isAdmin = session?.user?.role === "admin";

    return (
        <header className={sidebarStyles.topbar}>
            <div className={sidebarStyles.topbarLeft}>
                <Breadcrumbs/>
            </div>

            <div className={sidebarStyles.topbarRight}>
                <ThemeToggle/>
                {/*<NotificationDropdown/>*/}
                {/*<ChatboxDropdown isAdmin={isAdmin}/>*/}
            </div>
        </header>
    );
}
