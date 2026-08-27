"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-context";

type SidebarFrameProps = {
    toggleButton: ReactNode;
    children: ReactNode;
};

// Owns everything that needs the `collapsed` value at render time
// (the class name and the width). Session-derived markup is passed
// in as `children` from the async Server Component below.
export default function SidebarFrame({ toggleButton, children }: SidebarFrameProps) {
    const { collapsed } = useSidebar();

    return (
        <aside
            className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}
            id="sidebar"
            style={{ width: "var(--current-sidebar-width)" }}
        >
            <div className="sidebar-header">
                <a href="#" className="brand">
                    <span className="brand-name">dead-frequency</span>
                </a>
                {toggleButton}
            </div>
            {children}
        </aside>
    );
}