import {NavSection, SidebarNav} from "@/app/dashboard/components/sidebar-nav";
import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {getAvatarConfigForUser} from "@/feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";
import AdminIcon from "@/shared/svg/bootstrap-settings.svg";
import DotIcon from "@/shared/svg/bootstrap-three-dot-icon.svg";
import PageIcon from "@/shared/svg/page-icon.svg";
import {auth, SignOutButton} from "@core/auth";
import {DropdownMenu} from "@shared/components/dropdown-menu";
import styles from "@shared/styles/dashboard.module.css";
import {headers} from "next/headers";
import Link from "next/link";
import {JSX} from "react";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";

/**
 * The left-side bar.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the fully hydrated navigation column cluster.
 */
export async function Sidebar(): Promise<JSX.Element> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    const userName = session ? session.user.name : null;
    const userRole = session ? session.user.role : null;
    const isAdmin = userRole === "admin";

    /**
     * Splits full name structures along blank whitespace fragments, maps the first index character of individual
     * elements, glues up to two characters together, and pushes them to uppercase characters. Drops a smile symbol
     * emoji if missing names.
     **/
    const initials = session?.user?.name
        ? session.user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : ":)";

    // Resolves avatar canvas asset arrays, falling back to base models if the user has not designed one
    const avatarConfig = session
        ? (await getAvatarConfigForUser(session.user.id)) ?? DEFAULT_AVATAR_CONFIG
        : null;

    /**
     * Maintains separate visual menu tracking tiers, executing conditional element pushes using array interpolation
     * to inject administrative short-links if permissions are verified.
     **/
    const sections: NavSection[] = [
        {
            title: "Test Pages",
            items: [
                {href: "/style-test", label: "Style Test", icon: <PageIcon/>}
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
                                        /**
                                         * Fires an encrypted API request to wipe out session cookies directly on the
                                         * server whenever a client triggers the sign-out button option.
                                         **/
                                        action: async () => {
                                            "use server";
                                            await auth.api.signOut({headers: await headers()});
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : (
                    <span></span>
                )}
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
