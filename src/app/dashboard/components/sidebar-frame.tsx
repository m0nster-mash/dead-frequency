"use client";

import type {ReactNode} from "react";
import Link from "next/link";
import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@shared/styles/dashboard.module.css";

type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

export default function SidebarFrame({toggleButton, children}: SidebarFrameProps) {
    const {collapsed} = useSidebar();

    return (
        <aside className={`${styles.sidebar}${collapsed ? ` ${styles.sidebarCollapsed}` : ""}`}
               id="sidebar"
               data-collapsed={collapsed}
               style={{width: "var(--current-sidebar-width)"}}>
            <div className={styles.sidebarHeader}>
                {!collapsed && (
                    <Link href="/" className={styles.brand}>
                        <span className={styles.brandName}>dead-frequency</span>
                    </Link>
                )}
                {toggleButton}
            </div>
            {children}
        </aside>
    );
}