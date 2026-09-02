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
import styles from "@shared/styles/dashboard.module.css";
import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {getAvatarConfigForUser} from "@/feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";

export async function Sidebar() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    const userName = session ? session.user.name : null;
    const userRole = session ? session.user.role : null;
    const isAdmin = userRole === "admin";

    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : ":)";

    const avatarConfig = session
        ? (await getAvatarConfigForUser(session.user.id)) ?? DEFAULT_AVATAR_CONFIG
        : null;

    const sections: NavSection[] = [
        {
            title: "Test Pages",
            items: [
                {href: "/style-test", label: "Style Test", icon: <PageIcon/>},
                {href: "/avatar-test", label: "Avatar Test", icon: <PageIcon/>}
            ],
        },
        {
            title: "Features",
            items: [
                {href: "/avatar", label: "Avatar System", icon: <PageIcon/>},
                {href: "/forum", label: "Forum", icon: <PageIcon/>},
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
                        <div className={styles.avatar}>
                            {avatarConfig ? (
                                <AvatarRenderer config={avatarConfig} size={36}/>
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <div className={`${styles.userInfo} ${styles.hideOnCollapse}`}>
                            <strong>
                                <Link href={`/user/${session.user.id}`}>{userName}</Link>
                            </strong>
                            <span>{userRole}</span>
                        </div>
                        <div className={styles.hideOnCollapse}>
                            <DropdownMenu
                                trigger={<DotIcon/>}
                                align="start"
                                items={[
                                    {type: "link", label: "Update Avatar", href: "/avatar"},
                                    {type: "link", label: "Account Settings", href: "/settings"},
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
