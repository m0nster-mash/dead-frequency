"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@shared/styles/dashboard.module.css";
import {JSX, ReactNode} from "react";

/**
 * Properties for the SidebarFrame component.
 *
 * @property {ReactNode} toggleButton - Interactive trigger node (ex. hamburger switch) to adjust panel widths.
 * @property {ReactNode} children - Core contextual navigation lists or panel menus rendered within the panel body.
 */
type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

/**
 * The primary sidebar column for the dashboard layout.
 *
 * @param {SidebarFrameProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual side drawer component layer container wrapper.
 */
export default function SidebarFrame({toggleButton, children}: SidebarFrameProps): JSX.Element {
    const {collapsed} = useSidebar();

    return (
        <aside className={`${styles.sidebar}${collapsed ? ` ${styles.sidebarCollapsed}` : ""}`}
               id="sidebar"
               data-collapsed={collapsed}
               style={{width: "var(--current-sidebar-width)"}}>
            <div className={styles.sidebarHeader}>
                {!collapsed && (
                    <a href="/" className={styles.brand}>
                        <span className={styles.brandName}>dead-frequency</span>
                    </a>
                )}
                {toggleButton}
            </div>
            {children}
        </aside>
    );
}
