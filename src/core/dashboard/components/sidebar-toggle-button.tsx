"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@/shared/styles/dashboard.module.css";
import ArrowSquare from "@/shared/svg/bootstrap-left-square-icon.svg";

export default function SidebarToggleButton() {
    const {collapsed, toggle} = useSidebar();

    return (
        <button className={`${styles.iconButton} ${styles.sidebarToggle}`}
                id="sidebarToggle"
                aria-label="Toggle sidebar"
                aria-expanded={!collapsed}
                onClick={toggle}>
            <ArrowSquare/>
        </button>
    );
}