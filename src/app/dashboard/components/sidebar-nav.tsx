"use client";

import styles from "@shared/styles/dashboard.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {JSX, ReactNode} from "react";

/**
 * Structural definition for an individual navigation item anchor link.
 *
 * @property {string} href - Target URL or route pathname to navigate to
 * @property {string} label - Display text for the item link
 * @property {ReactNode} icon - SVG or layout component representing the item icon
 */
export type NavLinkItem = {
    href: string;
    label: string;
    icon: ReactNode;
};

/**
 * Structural layout grouping configuration block for the sidebar menu segments.
 *
 * @property {string} [title] - Optional label header text rendered above item subsets
 * @property {NavLinkItem[]} items - List collection of internal navigation link configurations
 */
export type NavSection = {
    title?: string;
    items: NavLinkItem[];
};

/**
 * Properties for the SidebarNav component.
 *
 * @property {NavSection[]} sections - Nested configuration list representing application sub-menus.
 */
type SidebarNavProps = {
    sections: NavSection[];
};

/**
 * Helper evaluation utility determining if a navigation link matches the current window location.
 * Uses path segment validation rules to correctly flag sub-routes or child views as active under parent sections.
 *
 * @param {string} pathname - Current active client path resolved from router hooks
 * @param {string} href - Destination configuration link property
 *
 * @returns {boolean} True if the route configuration string maps into or encompasses current pathname depths
 */
function isNavItemActive(pathname: string, href: string): boolean {
    // Explicit baseline catch to prevent root-level matching strings from matching sub-paths
    if (href === "/") {
        return pathname === "/";
    }
    // Resolves true on identical structural values or matching sub-folder structural trees
    return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * A Client Component that constructs the structured subsections and navigation link hierarchies.
 *
 * @param {SidebarNavProps} props - The component properties
 * @param {NavSection[]} props.sections - Structural list arrays containing categorical menu details
 *
 * @returns {JSX.Element} The visual side-panel interactive route matrix list block
 */
export function SidebarNav({sections}: SidebarNavProps): JSX.Element {
    // Hooks into active Next.js window router trajectories to pull matching data segments
    const pathname = usePathname();

    return (
        <nav className={styles.sidebarNav}>
            {sections.map((section, sectionIndex) => (
                <div key={section.title ?? sectionIndex}>
                    {section.title && (
                        <h5 className={styles.hideOnCollapse}>{section.title}</h5>
                    )}

                    {section.items.map((item) => {
                        const active = isNavItemActive(pathname, item.href);
                        return (
                            <Link key={item.href}
                                  href={item.href}
                                  className={`${styles.navItem}${active ? ` ${styles.active}` : ""}`}>
                                {item.icon}
                                <span className={styles.hideOnCollapse}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
