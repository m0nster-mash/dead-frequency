"use client";

import {useState} from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";

type NavItem = {
    label: string;
    href: string;
    icon: string;
}

const NAV_ITEMS: NavItem[] = [
    {label: "Home", href: "/", icon: "🏠"},
    {label: "Settings", href: "/settings", icon: "⚙️"},
    {label: "Style Test", href: "/style-test", icon: "📜"}
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.header}>
                {!collapsed && <span className={styles.brand}>Dead Frequency</span>}
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
                    aria-expanded={!collapsed}>
                    {collapsed ? "»" : "«"}
                </button>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.navItem} title={item.label}>
                        <span className={styles.icon}>{item.icon}</span>
                        {!collapsed && <span className={styles.label}>{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}