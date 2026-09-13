"use client";

import {useSidebar} from "@/_app/dashboard/components/sidebar-context";
import sidebarStyles from "@/_shared/styles/patterns/sidebar.module.css";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import LeftArrowSquare from "@/_shared/svg/bootstrap-left-square-icon.svg";
import RightArrowSquare from "@/_shared/svg/bootstrap-right-square-icon.svg";
import {JSX} from "react";

/**
 * An interactive Client Component button that controls the centralized layout sidebar dimensional tracking states.
 *
 * @returns {JSX.Element} The visual structural layout state modifier switch button.
 */
export default function _sidebarToggleButton(): JSX.Element {
    const {collapsed, toggle} = useSidebar();

    return (
        <button
            className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled} ${buttonStyles.iconBtnMd} ${sidebarStyles.sidebarToggle}`}
            id="sidebarToggle"
            aria-label="Toggle sidebar"
            aria-expanded={!collapsed}
            onClick={toggle}>
            {collapsed ? <RightArrowSquare/> : <LeftArrowSquare/>}
        </button>
    );
}
