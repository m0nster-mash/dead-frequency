import {headers} from "next/headers";
import Link from "next/link";
import {auth} from "@core/auth";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";
import {SignOutButton} from "@core/auth";
import PageIcon from "@/shared/svg/page-icon.svg";
import SquareIcon from "@/shared/svg/four-squares-icon.svg";
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";
import DotIcon from "@/shared/svg/bootstrap-three-dot-icon.svg"
import AdminIcon from "@/shared/svg/bootstrap-settings.svg";
import styles from "@shared/styles/dashboard.module.css";
import {DropdownMenu} from "@shared/components/dropdown-menu";

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
                    <div className={styles.userCard}>
                        <div className={styles.avatar}>SK</div>
                        <div className={`${styles.userInfo} ${styles.hideOnCollapse}`}>
                            <strong>{userName}</strong>
                            <span>{userRole}</span>
                        </div>
                        <div className={styles.hideOnCollapse}>
                            <DropdownMenu
                                trigger={<DotIcon/>}
                                align="start"
                                items={[
                                    // {type: "header", label: userName ?? "Account"},
                                    {type: "link", label: "Settings", href: "/settings"},
                                    {type: "divider"},
                                    {
                                        type: "action",
                                        label: "Sign out",
                                        danger: false,
                                        action: async () => {
                                            "use server";
                                            await auth.api.signOut({headers: await headers()});
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : (<span></span>)}
            </div>
            <nav className={styles.sidebarNav}>
                <h5 className={styles.hideOnCollapse}>Workspace</h5>
                <Link href="/" className={`${styles.navItem} ${styles.active}`}>
                    <SquareIcon/>
                    <span className={styles.hideOnCollapse}>Dashboard</span>
                </Link>
                <Link href="/style-test" className={styles.navItem}>
                    <PageIcon/>
                    <span className={styles.hideOnCollapse}>Style Test</span>
                </Link>
                {session ? (
                    <Link href="/settings" className={styles.navItem}>
                        <GearIcon/>
                        <span className={styles.hideOnCollapse}>Settings</span>
                    </Link>
                ) : (<span></span>)}
                <h5 className={styles.hideOnCollapse}>Other Menu</h5>
                <Link href="/" className={styles.navItem}>
                    <SquareIcon/>
                    <span className={styles.hideOnCollapse}>Whatever</span>
                </Link>
                <Link href="/style-test" className={styles.navItem}>
                    <PageIcon/>
                    <span className={styles.hideOnCollapse}>Something Else</span>
                </Link>
                {isAdmin ? (
                    <span>
                        <h5 className={styles.hideOnCollapse}>Management</h5>
                        <Link href="/admin" className={styles.navItem}>
                            <AdminIcon/>
                            <span className={styles.hideOnCollapse}>Admin Panel</span>
                        </Link>
                    </span>
                ) : (<span></span>)}

            </nav>
            {session ? (
                <div className={styles.sidebarFooter}>
                    <SignOutButton/>
                </div>
            ) : (
                <div>
                    <Link href="/login" className={styles.navItem}>
                        <GearIcon/>
                        <span className={styles.hideOnCollapse}>Login / Register</span>
                    </Link>
                </div>
            )}
        </SidebarFrame>
    );
}