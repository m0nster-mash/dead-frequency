import Link from "next/link";
import {auth, SignOutButton} from "@core/auth";
import {headers} from "next/headers";
import {DropdownMenu} from "@shared/components/dropdown-menu";
import {NavSection, SidebarNav} from "@/app/dashboard/components/sidebar-nav";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";
import AdminIcon from "@/shared/svg/bootstrap-settings.svg";
import DotIcon from "@/shared/svg/bootstrap-three-dot-icon.svg"
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";
import PageIcon from "@/shared/svg/page-icon.svg";
import SquareIcon from "@/shared/svg/four-squares-icon.svg";
import styles from "@shared/styles/dashboard.module.css";

export async function Sidebar() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    const userName = session ? session.user.name : null;
    const userRole = session ? session.user.role : null;
    const isAdmin = userRole === "admin";

    const sections: NavSection[] = [
        {
            title: "Workspace",
            items: [
                {href: "/", label: "Dashboard", icon: <SquareIcon/>},
                {href: "/style-test", label: "Style Test", icon: <PageIcon/>},
                {href: "/avatar-test", label: "Avatar Test", icon: <PageIcon/>},
                ...(session
                    ? [{href: "/settings", label: "Settings", icon: <GearIcon/>}]
                    : []),
            ],
        },
        ...(isAdmin
            ? [{
                title: "Management",
                items: [{href: "/admin", label: "Admin Panel", icon: <AdminIcon/>}],
            }]
            : []),
    ];

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

            <SidebarNav sections={sections}/>

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