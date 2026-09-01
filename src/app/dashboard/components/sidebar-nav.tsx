"use client";

import type {ReactNode} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from "@shared/styles/dashboard.module.css";

export type NavLinkItem = {
    href: string;
    label: string;
    icon: ReactNode;
};

export type NavSection = {
    title?: string;
    items: NavLinkItem[];
};

type SidebarNavProps = {
    sections: NavSection[];
};

function isNavItemActive(pathname: string, href: string): boolean {
    if (href === "/") {
        return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({sections}: SidebarNavProps) {
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