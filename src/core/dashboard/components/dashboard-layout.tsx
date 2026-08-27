"use client";

import {ReactNode, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {SignOutButton} from "@/core/auth/components/sign-out-button";
import styles from "./dashboard-layout.module.css";

type NavItem = {
    href: string;
    label: string;
    icon: string;
};

const NAV_ITEMS: NavItem[] = [
    {href: "/dashboard", label: "Dashboard", icon: "🏠"},
    {href: "/style-test", label: "Style Test", icon: "🗒️"},
    {href: "/dashboard/settings", label: "Settings", icon: "⚙️"},
];

const ADMIN_NAV_ITEM: NavItem = {
    href: "/dashboard/admin",
    label: "Admin Panel",
    icon: "🛡️",
};

type AppShellProps = {
    children: ReactNode;
    userName?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
};

export function DashboardLayout({children, userName, userEmail, userRole}: AppShellProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const isAdmin = userRole === "admin";
    const navItems = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

    return (
        <div className={styles.shell}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
                <div className={styles.sidebarHeader}>
                    {!collapsed && <span className={styles.brand}>Dead Frequency</span>}
                    <button type="button"
                            className={styles.collapseButton}
                            onClick={() => setCollapsed((prev) => !prev)}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            aria-expanded={!collapsed}>
                        {collapsed ? "»" : "«"}
                    </button>
                </div>

                <Link href="/dashboard/settings"
                      className={`${styles.profile} ${collapsed ? styles.profileCollapsed : ""}`}
                      title={collapsed ? "Account Settings" : undefined}>
                    <span className={styles.avatar} aria-hidden="true"/>
                    {!collapsed && (
                        <span className={styles.profileInfo}>
                            <span className={styles.profileName}>{userName ?? "Anonymous"}</span>
                            {userEmail && <span className={styles.profileEmail}>{userEmail}</span>}
                        </span>
                    )}
                </Link>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                        return (
                            <Link key={item.href}
                                  href={item.href}
                                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                                  title={collapsed ? item.label : undefined}>
                                <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    {!collapsed && (
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{userName ?? "Anonymous"}</span>
                            {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
                        </div>
                    )}
                    <SignOutButton/>
                </div>
            </aside>

            <main className={styles.content}>{children}</main>
        </div>
    );
}