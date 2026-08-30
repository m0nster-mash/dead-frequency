import {headers} from "next/headers";
import {auth} from "@core/auth";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";
import {SignOutButton} from "@core/auth";
import PageIcon from "@/shared/svg/page-icon.svg";
import SquareIcon from "@/shared/svg/four-squares-icon.svg";
import GearIcon from "@/shared/svg/gear-icon.svg";

export async function Sidebar() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    const userName = session ? session.user.name : null;
    const userRole = session ? session.user.role : null;
    const isAdmin = userRole === "admin";

    return (
        <SidebarFrame toggleButton={<SidebarToggleButton/>}>
            <div>
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
                <h5>Workspace</h5>
                <a href="/" className="nav-item active">
                    <SquareIcon/>
                    <span>Dashboard</span>
                </a>
                <a href="/style-test" className="nav-item">
                    <PageIcon/>
                    <span>Style Test</span>
                </a>
                {session ? (
                    <a href="/settings" className="nav-item">
                        <GearIcon/>
                        <span>Settings</span>
                    </a>
                ) : (<span></span>)}
                <h5>Other Menu</h5>
                <a href="/" className="nav-item">
                    <SquareIcon/>
                    <span>Whatever</span>
                </a>
                <a href="/style-test" className="nav-item">
                    <PageIcon/>
                    <span>Something Else</span>
                </a>
                {isAdmin ? (
                    <span>
                        <h5>Management</h5>
                        <a href="/admin" className="nav-item">
                            <GearIcon/>
                            <span>Admin Panel</span>
                        </a>
                    </span>
                ) : (<span></span>)}

            </nav>
            {session ? (
                <div className="sidebar-footer">
                    <SignOutButton/>
                </div>
            ) : (
                <div>
                    <a href="/login" className="nav-item">
                        <GearIcon/>
                        <span>Login / Register</span>
                    </a>
                </div>
            )}
        </SidebarFrame>
    );
}