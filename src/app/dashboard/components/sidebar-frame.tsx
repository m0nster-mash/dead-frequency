"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@shared/styles/dashboard.module.css";
import Link from "next/link";
import {JSX, ReactNode} from "react";

/**
 * Properties for the SidebarFrame component.
 *
 * @property {ReactNode} toggleButton - Interactive trigger element (an icon button) to toggle layout width
 * @property {ReactNode} children - Navigation links or panel elements rendered within the body of the sidebar
 */
type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

/**
 * A Client Component that structuralizes the outer layout frame of the dashboard navigation column.
 *
 * @param {SidebarFrameProps} props - The component properties
 * @param {ReactNode} props.toggleButton - Renderable node containing layout triggers
 * @param {ReactNode} props.children - Context child anchors to project down inside navigation list tracks
 *
 * @returns {JSX.Element} The visual side drawer component layer wrapper
 */
export default function SidebarFrame({toggleButton, children}: SidebarFrameProps): JSX.Element {
    // Collects current layout metadata flags from context handlers
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
