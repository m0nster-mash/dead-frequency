import {headers} from "next/headers";
import {auth} from "@core/auth";
import BellIcon from "@/shared/svg/bell-icon.svg";

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
        <header className="topbar">
            <div className="topbar-left">
                <div className="breadcrumb">
                    <strong>Dashboard</strong>
                </div>
            </div>
            <div className="topbar-right">
                <button className="icon-button notification-button" aria-label="Notifications">
                    <BellIcon/>
                    <span className="notification-dot"></span>
                </button>
                <div className="topbar-avatar">{initials}</div>
            </div>
        </header>
    );
}