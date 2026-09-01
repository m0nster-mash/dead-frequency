"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@/shared/styles/dashboard.module.css";
import LeftArrowSquare from "@/shared/svg/bootstrap-left-square-icon.svg";
import RightArrowSquare from "@/shared/svg/bootstrap-right-square-icon.svg";

export default function SidebarToggleButton() {
    const {collapsed, toggle} = useSidebar();

    return (
        <button className={`${styles.iconButton} ${styles.sidebarToggle}`}
                id="sidebarToggle"
                aria-label="Toggle sidebar"
                aria-expanded={!collapsed}
                onClick={toggle}>
            {collapsed ? <RightArrowSquare/> : <LeftArrowSquare/>}
        </button>
    );
}