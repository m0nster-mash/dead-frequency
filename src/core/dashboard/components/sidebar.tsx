import {headers} from "next/headers";
import {auth} from "@core/auth";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";
import {SignOutButton} from "@core/auth";
import PageIcon from "@/shared/svg/page-icon.svg";
import SquareIcon from "@/shared/svg/four-squares-icon.svg";
import GearIcon from "@/shared/svg/gear-icon.svg";

export default async function Sidebar() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    const userName = session ? session.user.name : null;
    const userRole = session ? session.user.role : null;

    return (
        <SidebarFrame toggleButton={<SidebarToggleButton/>}>
            <div className="sidebar-footer">
                {session ? (
                    <div className="user-card">
                        <div className="avatar">SK</div>
                        <div className="user-info">
                            <strong>{userName}</strong>
                            <span>{userRole}</span>
                        </div>
                        <button className="more-button" aria-label="More options">•••</button>
                    </div>
                ) : (<span></span>)}
            </div>
            <nav className="sidebar-nav">
                <p className="nav-label">Workspace</p>
                <a href="/" className="nav-item active">
                    <SquareIcon/>
                    <span>Dashboard</span>
                </a>
                <a href="/style-test" className="nav-item">
                    <PageIcon/>
                    <span>Style Test</span>
                </a>
                <p className="nav-label nav-label-spaced">Management</p>
                <a href="#" className="nav-item">
                    <GearIcon/>
                    <span>Settings</span>
                </a>
            </nav>
            <div className="sidebar-footer">
                {session ? (
                    <SignOutButton/>
                ) : (<div></div>)}
            </div>
        </SidebarFrame>
    );
}