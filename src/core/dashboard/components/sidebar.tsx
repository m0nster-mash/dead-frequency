import {NavSection, SidebarNav} from "@/app/dashboard/components/sidebar-nav";
import {auth, SignOutButton} from "@/core/auth";
import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {getAvatarConfigForUser} from "@/feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import {DropdownMenu} from "@/shared/components/dropdown-menu";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import ForumIcon from "@/shared/svg/bootstrap-forum-icon.svg";
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";
import PersonIcon from "@/shared/svg/bootstrap-person-icon.svg";
import QuestionIcon from "@/shared/svg/bootstrap-question-icon.svg";
import AdminIcon from "@/shared/svg/bootstrap-settings.svg";
import DotIcon from "@/shared/svg/bootstrap-three-dot-icon.svg";
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
                {
                    href: "/style-test",
                    label: "Style Test",
                    icon: <QuestionIcon/>,
                },
            ],
        },
        {
            title: "Features",
            items: [
                {
                    href: "/avatar",
                    label: "Avatar System",
                    icon: <PersonIcon/>,
                },
                {
                    href: "/forum",
                    label: "Forum",
                    icon: <ForumIcon/>,
                }
            ],
        },
        ...(isAdmin
            ? [
                {
                    title: "Management",
                    items: [
                        {
                            type: "expandable" as const,
                            label: "Administration",
                            icon: <AdminIcon/>,
                            links: [
                                {href: "/admin/users", label: "Users", icon: <GearIcon/>},
                                {href: "/admin/forum", label: "Forum Management", icon: <GearIcon/>},
                                {href: "/admin/audit-log", label: "Audit Log", icon: <GearIcon/>},
                                {href: "/admin/reports", label: "Reports", icon: <GearIcon/>}
                            ],
                        },
                    ],
                },
            ]
            : []),
    ];

    return (
        <SidebarFrame toggleButton={<SidebarToggleButton/>}>
            <div>
                {session ? (
                    <div className={sidebarStyles.userCard}>
                        <div>
                            {avatarConfig ? (
                                <AvatarRenderer config={avatarConfig} size={36}/>
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        <div className={`${sidebarStyles.userInfo} ${sidebarStyles.hideOnCollapse}`}>
                            <strong>
                                <Link href={`/user/${session.user.id}`}>{userName}</Link>
                            </strong>
                            <span>{userRole}</span>
                        </div>

                        <div className={sidebarStyles.hideOnCollapse}>
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
                ) : (
                    <span></span>
                )}
            </div>

            <SidebarNav sections={sections}/>

            {session ? (
                <div className={sidebarStyles.sidebarFooter}>
                    <SignOutButton/>
                </div>
            ) : (
                <div>
                    <Link href="/login" className={sidebarStyles.navItem}>
                        <GearIcon/>
                        <span className={sidebarStyles.hideOnCollapse}>Login / Register</span>
                    </Link>
                </div>
            )}
        </SidebarFrame>
    );
}
