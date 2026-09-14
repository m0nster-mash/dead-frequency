"use client";

import {useSidebar} from "@/core/dashboard/components/navigation/sidebar-context";
import brandStyles from "@/shared/styles/brand.module.css";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import Link from "next/link";
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
 */
export default function SidebarFrame({toggleButton, children}: SidebarFrameProps): JSX.Element {
    const {collapsed} = useSidebar();

    return (
        <aside className={sidebarStyles.sidebar}
               id="sidebar"
               data-collapsed={collapsed}
               style={{width: "var(--current-sidebar-width)"}}>
            <div className={sidebarStyles.sidebarHeader}>
                {!collapsed && (
                    <Link href="/" className={brandStyles.brand}>
                        <span className={brandStyles.brandName}>dead-frequency</span>
                    </Link>
                )}
                {toggleButton}
            </div>
            {children}
        </aside>
    );
}
