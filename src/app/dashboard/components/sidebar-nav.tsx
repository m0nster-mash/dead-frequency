"use client";

import DownArrowIcon from "@/shared/svg/bootstrap-down-arrow-icon.svg";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {JSX, ReactNode, useEffect, useState} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Structural definition for an individual navigation item anchor link.
 *
 * @property {string} href - Target URL or route pathname to navigate to.
 * @property {string} label - Display text for the item link.
 * @property {ReactNode} icon - SVG or layout component representing the item icon.
 * @property {string} [type] - Optional type identifier. Defaults to "link" if not specified.
 */
export type NavLinkItem = {
    type?: "link";
    href: string;
    label: string;
    icon: ReactNode;
};

/**
 * Structural definition for an expandable navigation item.
 *
 * The item itself behaves like a sidebar menu item, but clicking it reveals
 * the nested navigation links beneath it.
 *
 * @property {string} type - Discriminator for this item type. Must be "expandable".
 * @property {string} label - Display text for the expandable menu item.
 * @property {ReactNode} icon - SVG or layout component representing the item icon.
 * @property {NavLinkItem[]} links - Collection of child navigation links revealed when expanded.
 * @property {boolean} [defaultOpen] - Whether the menu should be open by default. Defaults to false.
 */
export type ExpandableNavItem = {
    type: "expandable";
    label: string;
    icon: ReactNode;
    links: NavLinkItem[];
    defaultOpen?: boolean;
};

/**
 * Union type for navigation menu items.
 *
 * A sidebar item can either be a normal link or an expandable menu.
 */
export type NavItem = NavLinkItem | ExpandableNavItem;

/**
 * Structural layout grouping configuration block for the sidebar menu segments.
 *
 * @property {string} [title] - Optional label header text rendered above item subsets.
 * @property {NavItem[]} items - List collection of internal navigation link configurations.
 */
export type NavSection = {
    title?: string;
    items: NavItem[];
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
 * Determines if a navigation link matches the current window location.
 *
 * Uses path segment validation rules to correctly flag sub-routes or child views
 * as active under parent sections.
 *
 * @param {string} pathname - Current active client path resolved from router hooks.
 * @param {string} href - Destination configuration link property.
 *
 * @returns {boolean} True if the route configuration string maps into or encompasses current pathname depths.
 */
function isNavItemActive(pathname: string, href: string): boolean {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Determines whether an expandable item should be considered active.
 *
 * An expandable menu is active whenever one of its child links matches
 * the current pathname.
 *
 * @param {string} pathname - Current active client path.
 * @param {ExpandableNavItem} item - The expandable menu item to evaluate.
 *
 * @returns {boolean} True if any child link matches the current pathname.
 */
function isExpandableItemActive(pathname: string, item: ExpandableNavItem): boolean {
    return item.links.some((link) =>
        isNavItemActive(pathname, link.href),
    );
}

/**
 * Reusable expandable sidebar menu item component.
 *
 * @returns {JSX.Element} The expandable menu UI element.
 */
function ExpandableMenuItem({item, pathname}: {
    item: ExpandableNavItem;
    pathname: string;
}): JSX.Element {
    const hasActiveChild = isExpandableItemActive(pathname, item);

    const [isOpen, setIsOpen] = useState(
        item.defaultOpen ?? hasActiveChild,
    );

    /**
     * Automatically open the menu when the current route belongs to one
     * of its child links.
     */
    useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [hasActiveChild]);

    return (
        <div>
            <button type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    title={item.label}
                    className={`${sidebarStyles.expandableNavButton}${hasActiveChild ? ` ${sidebarStyles.active}` : ""}`}>
                {item.icon}

                <span className={sidebarStyles.hideOnCollapse}>
                    {item.label}
                </span>

                <span className={`${sidebarStyles.expandIcon} ${
                    isOpen ? sidebarStyles.expandIconOpen : ""
                } ${sidebarStyles.hideOnCollapse}`}
                      aria-hidden="true">
                    <DownArrowIcon/>
                </span>
            </button>

            {isOpen && (
                <div className={sidebarStyles.subNav}>
                    {item.links.map((link) => {
                        const active = isNavItemActive(
                            pathname,
                            link.href,
                        );

                        return (
                            <Link key={link.href}
                                  href={link.href}
                                  title={link.label}
                                  className={`${sidebarStyles.subNavItem}${
                                      active ? ` ${sidebarStyles.active}` : ""
                                  }`}>
                                {link.icon}

                                <span className={sidebarStyles.hideOnCollapse}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/**
 * Constructs the structured subsections and navigation link hierarchies.
 *
 * Renders sidebar navigation sections with support for both simple links and
 * expandable menu items. Automatically highlights active routes and their parent
 * menus.
 *
 * @param {SidebarNavProps} props - The component properties.
 * @param {NavSection[]} props.sections - Structural list arrays containing categorical menu details.
 *
 * @returns {JSX.Element} The visual side-panel interactive route matrix list block.
 */
export function SidebarNav({sections}: SidebarNavProps): JSX.Element {
    const pathname = usePathname();

    return (
        <nav className={sidebarStyles.sidebarNav}>
            {sections.map((section, sectionIndex) => (
                <div key={section.title ?? sectionIndex}>
                    {section.title && (
                        <h5 className={sidebarStyles.hideOnCollapse}>
                            {section.title}
                        </h5>
                    )}

                    {section.items.map((item) => {
                        if (item.type === "expandable") {
                            return (
                                <ExpandableMenuItem key={item.label}
                                                    item={item}
                                                    pathname={pathname}/>
                            );
                        }

                        const active = isNavItemActive(
                            pathname,
                            item.href,
                        );

                        return (
                            <Link key={item.href}
                                  href={item.href}
                                  title={item.label}
                                  className={`${sidebarStyles.navItem}${
                                      active ? ` ${sidebarStyles.active}` : ""
                                  }`}>
                                {item.icon}

                                <span className={sidebarStyles.hideOnCollapse}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
