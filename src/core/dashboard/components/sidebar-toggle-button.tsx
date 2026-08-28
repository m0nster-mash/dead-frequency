"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";

export default function SidebarToggleButton() {
    const {collapsed, toggle} = useSidebar();

    return (
        <button className="icon-button sidebar-toggle"
                id="sidebarToggle"
                aria-label="Toggle sidebar"
                aria-expanded={!collapsed}
                onClick={toggle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
    );
}