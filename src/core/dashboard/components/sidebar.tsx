import {_sidebarNav, NavSection} from "@/_app/dashboard/components/_sidebar-nav";
import {_signOutButton, auth} from "@/_core/auth";
import {AvatarRenderer} from "@/_feature/avatar/components/avatar-renderer";
import {getAvatarConfigForUser} from "@/_feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/_feature/avatar/lib/options";
import {DropdownMenu} from "@/_shared/components/dropdown-menu";
import sidebarStyles from "@/_shared/styles/patterns/sidebar.module.css";
import ForumIcon from "@/_shared/svg/bootstrap-forum-icon.svg";
import GearIcon from "@/_shared/svg/bootstrap-gear-icon.svg";
import PersonIcon from "@/_shared/svg/bootstrap-person-icon.svg";
import QuestionIcon from "@/_shared/svg/bootstrap-question-icon.svg";
import AdminIcon from "@/_shared/svg/bootstrap-settings.svg";
import DotIcon from "@/_shared/svg/bootstrap-three-dot-icon.svg";
import {headers} from "next/headers";
import Link from "next/link";
import {JSX} from "react";
import SidebarFrame from "./sidebar-frame";
import SidebarToggleButton from "./sidebar-toggle-button";

/**
 * The left-side bar.
 */
export async function _sidebar(): Promise<JSX.Element> {
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
                    href: "/test/styles/",
                    label: "Style Test",
                    icon: <QuestionIcon/>,
                },
                {
                    href: "/test/chatbox/",
                    label: "Chatbox",
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

            <_sidebarNav sections={sections}/>

            {session ? (
                <div className={sidebarStyles.sidebarFooter}>
                    <_signOutButton/>
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
