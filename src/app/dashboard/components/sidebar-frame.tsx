"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import brandStyles from "@/shared/styles/brand.module.css";
import Link from "next/link";
import {JSX, ReactNode} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Properties for the SidebarFrame component.
 *
 * @property {ReactNode} toggleButton - Interactive trigger element (an icon button) to toggle layout width.
 * @property {ReactNode} children - Navigation links or panel elements rendered within the body of the sidebar.
 */
type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

/**
 * A client component that structuralizes the outer layout frame of the dashboard navigation column.
 *
 * @param {SidebarFrameProps} props - The component properties.
 * @param {ReactNode} props.toggleButton - Renderable node containing layout triggers.
 * @param {ReactNode} props.children - Context child anchors to project down inside navigation list tracks.
 *
 * @returns {JSX.Element} The visual side drawer component layer wrapper.
 */
export default function SidebarFrame({toggleButton, children}: SidebarFrameProps): JSX.Element {
    // collects current layout metadata flags from context handlers
    const {collapsed} = useSidebar();

    return (
        <aside className={`${sidebarStyles.sidebar}${collapsed ? ` ${sidebarStyles.sidebarCollapsed}` : ""}`}
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
