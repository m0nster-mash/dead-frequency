"use client";

import dropdownStyles from "@/shared/styles/patterns/dropdown-menu.module.css";
import Link from "next/link";
import {JSX, ReactNode, useEffect, useRef, useState} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Union configuration options defining a single render item inside the dropdown matrix. Supports hyperlinks,
 * action dispatcher triggers, text headers, and visual line dividers.
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
 *
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
 *
 * @returns {JSX.Element} The visual collapsible context operations dropdown wrapper.
 */
export function DropdownMenu({trigger, items, align = "end"}: DropdownMenuProps): JSX.Element {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Resolves localized structural class names based on target horizontal boundary alignments
    const menuClassName = align === "start"
        ? `${dropdownStyles.dropdownMenu} ${dropdownStyles.dropdownMenuStart}`
        : `${dropdownStyles.dropdownMenu} ${dropdownStyles.dropdownMenuEnd}`;

    // Manages dynamic window close traps following interface presentation states
    useEffect(() => {
        // Skip attaching window listeners if the contextual element rests hidden
        if (!open) return;

        /**
         * Intercepts clicks throughout the screen viewport window. Auto-collapses the menu container if pointers
         * crash outside the bounding reference container box.
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

        // Securely detaches listener hooks once state changes trigger collapse structures
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <div className={dropdownStyles.dropdown} ref={containerRef}>
            <button type="button"
                    className={dropdownStyles.dropdownToggleButton}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((prev) => !prev)}>
                {trigger}
            </button>

            {open && (
                <ul role="menu" className={menuClassName}>
                    {items.map((item, index) => {
                        if (item.type === "divider") {
                            return <li key={index} role="separator" className={dropdownStyles.dropdownDivider}/>;
                        }

                        if (item.type === "header") {
                            return <li key={index} className={dropdownStyles.dropdownHeader}>{item.label}</li>;
                        }

                        const itemClass = `${dropdownStyles.dropdownItem} ${item.danger
                            ? dropdownStyles.dropdownItemDanger
                            : ""} ${item.disabled ? dropdownStyles.dropdownItemDisabled : ""}`;

                        return (
                            <li key={index}>
                                {item.type === "link" ? (
                                    <Link href={item.href}
                                          role="menuitem"
                                          className={itemClass}
                                          aria-disabled={item.disabled}
                                          onClick={() => setOpen(false)}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <button type="button"
                                            role="menuitem"
                                            className={itemClass}
                                            disabled={item.disabled}
                                            onClick={() => {
                                                void item.action();
                                                setOpen(false);
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
