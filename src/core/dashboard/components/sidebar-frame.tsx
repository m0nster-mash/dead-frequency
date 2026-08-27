"use client";

import type {ReactNode} from "react";
import {useSidebar} from "@/app/dashboard/components/sidebar-context";

type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

export default function SidebarFrame({toggleButton, children}: SidebarFrameProps) {
    const {collapsed} = useSidebar();

    return (
        <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}
               id="sidebar"
               style={{width: "var(--current-sidebar-width)"}}>
            <div className="sidebar-header">
                <a href="/" className="brand">
                    <span className="brand-name">dead-frequency</span>
                </a>
                {toggleButton}
            </div>
            {children}
        </aside>
    );
}