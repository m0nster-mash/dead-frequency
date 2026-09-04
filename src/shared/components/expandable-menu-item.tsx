"use client";

import DownArrowIcon from "@/shared/svg/bootstrap-down-arrow-icon.svg";
import styles from "@shared/styles/dashboard.module.css";
import Link from "next/link";
import {JSX, ReactNode, useState} from "react";

/**
 * Structural definition for a link within an expandable menu.
 *
 * @property {string} label - Display text for the menu link.
 * @property {string} href - Target URL or route pathname to navigate to.
 */
export type MenuLink = {
    label: string;
    href: string;
};

/**
 * Properties for the ExpandableMenuItem component.
 *
 * @property {string} label - Display text for the expandable menu button.
 * @property {ReactNode} [icon] - Optional SVG or layout component representing the item icon.
 * @property {MenuLink[]} links - Collection of child navigation links revealed when expanded.
 * @property {boolean} [defaultOpen] - Whether the menu should be open by default. Defaults to false.
 */
type ExpandableMenuItemProps = {
    label: string;
    icon?: ReactNode;
    links: MenuLink[];
    defaultOpen?: boolean;
};

/**
 * Reusable expandable menu item component.
 *
 * Renders a collapsible button that toggles visibility of nested navigation links.
 * Styled consistently with the sidebar navigation system and automatically centers
 * content when the sidebar is in collapsed state.
 *
 * @param {ExpandableMenuItemProps} props - Component properties.
 *
 * @returns {JSX.Element} The expandable menu UI element.
 */
export default function ExpandableMenuItem({
                                               label,
                                               icon,
                                               links,
                                               defaultOpen = false,
                                           }: ExpandableMenuItemProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div>
            <button type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    title={label}
                    className={styles.expandableNavButton}>
                <span className={styles.expandableMenuButtonContent}>
                    {icon && <span>{icon}</span>}
                    <span className={styles.hideOnCollapse}>{label}</span>
                </span>

                <svg className={`${styles.expandIcon} ${
                    isOpen ? styles.expandIconOpen : ""
                } ${styles.hideOnCollapse}`}
                     viewBox="0 0 20 20"
                     fill="currentColor"
                     aria-hidden="true">
                    <DownArrowIcon/>
                </svg>
            </button>

            <div className={`${styles.subNav} ${
                isOpen ? styles.subNavOpen : styles.subNavClosed
            }`}>
                {links.map((link) => (
                    <Link key={link.href}
                          href={link.href}
                          title={link.label}
                          className={styles.subNavItem}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
