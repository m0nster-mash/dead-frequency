"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@/shared/styles/dashboard.module.css";
import LeftArrowSquare from "@/shared/svg/bootstrap-left-square-icon.svg";
import RightArrowSquare from "@/shared/svg/bootstrap-right-square-icon.svg";
import {JSX} from "react";

/**
 * An interactive Client Component button that controls the centralized layout sidebar dimensional tracking states.
 *
 * @returns {JSX.Element} The visual structural layout state modifier switch button.
 */
export default function SidebarToggleButton(): JSX.Element {
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
