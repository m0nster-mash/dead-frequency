"use client";

import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import Link from "next/link";
import styles from "@/shared/styles/dropdown-menu.module.css";

/**
 * Union configuration options defining a single render item inside the dropdown matrix.
 * Supports hyperlinks, action dispatcher triggers, text headers, and visual line dividers.
 *
 * @typedef {Object} DropdownMenuItem
 */
export type DropdownMenuItem = | {
    type: "link";
    label: string;
    href: string;
    icon?: ReactNode;
    danger?: boolean;
    disabled?: boolean;
} | {
    type: "action";
    label: string;
    action: () => void | Promise<void>;
    icon?: ReactNode;
    danger?: boolean;
    disabled?: boolean;
} | {
    type: "divider";
} | {
    type: "header";
    label: string;
};

/**
 * Properties for the DropdownMenu component.
 * @typedef {Object} DropdownMenuProps
 * @property {ReactNode} trigger - Visual node structure acting as the interactive toggle button (ex. icons, avatars).
 * @property {DropdownMenuItem[]} items - Collection list tracking structural menu layer definitions.
 * @property {"start" | "end"} [align="end"] - Spatial positioning parameter governing side panel attachment margins.
 */
type DropdownMenuProps = {
    trigger: ReactNode;
    items: DropdownMenuItem[];
    align?: "start" | "end";
};

/**
 * An interactive Client Component dropdown card context utility designed for profile menus and toolbar action items.
 * Implements defensive event capture listeners to automate click-away dismissals and keyboard shortcuts.
 *
 * @param {DropdownMenuProps} props - The component properties.
 * @returns {JSX.Element} The visual collapsible context operations dropdown wrapper.
 */
export function DropdownMenu({trigger, items, align = "end"}: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Resolves localized structural class names based on target horizontal boundary alignments
    const menuClassName = align === "start"
        ? `${styles.dropdownMenu} ${styles.dropdownMenuStart}`
        : `${styles.dropdownMenu} ${styles.dropdownMenuEnd}`;

    // Context Side-Effect: Manages dynamic window close traps following interface presentation states
    useEffect(() => {
        // Skip attaching window listeners if the contextual element rests hidden
        if (!open) return;

        /**
         * Intercepts clicks throughout the screen viewport window.
         * Auto-collapses the menu container if pointers crash outside the bounding reference container box.
         */
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        /**
         * Intercepts keystroke commands globally to allow keyboard-driven menu dismissals (`Escape`).
         */
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        // Memory Cleanup Lifecycle Hook: Securely detaches listener hooks once state changes trigger collapse structures
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        /* Top-level wrapping landmark boundary mapping DOM metrics references onto hook traps */
        <div className={styles.dropdown} ref={containerRef}>
            {/*
               Accessible Trigger Button Element:
               Binds aria-attributes to clearly advertise layout overlay relationship states to assistive agents.
            */}
            <button type="button"
                    className={styles.dropdownToggleButton}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((prev) => !prev)}>
                {trigger}
            </button>

            {/* Collapsible Action Sub-Menu Overlay Stack */}
            {open && (
                <ul role="menu" className={menuClassName}>
                    {/* Iterates through nested type layers compiling matching structural elements */}
                    {items.map((item, index) => {
                        // Structural Branch 1: Visual section separation line rows
                        if (item.type === "divider") {
                            return <li key={index} role="separator" className={styles.dropdownDivider}/>;
                        }

                        // Structural Branch 2: Informational category label rows
                        if (item.type === "header") {
                            return <li key={index} className={styles.dropdownHeader}>{item.label}</li>;
                        }

                        // Compiles baseline modification style utilities tracking error states or loading parameters
                        const itemClass = `${styles.dropdownItem} ${item.danger
                            ? styles.dropdownItemDanger
                            : ""} ${item.disabled ? styles.dropdownItemDisabled : ""}`;

                        return (
                            <li key={index}>
                                {item.type === "link" ? (
                                    /* Interactive Route Target 1: Next-js routing hyperlink pathways */
                                    <Link href={item.href}
                                          role="menuitem"
                                          className={itemClass}
                                          aria-disabled={item.disabled}
                                          onClick={() => setOpen(false)}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    /* Interactive Route Target 2: Standard client event execution dispatch triggers */
                                    <button type="button"
                                            role="menuitem"
                                            className={itemClass}
                                            disabled={item.disabled}
                                            onClick={() => {
                                                void item.action(); // Dispatches associated callback routine asynchronously
                                                setOpen(false);      // Cleanly dismisses the overlay card view
                                            }}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
