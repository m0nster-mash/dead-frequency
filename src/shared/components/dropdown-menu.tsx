"use client";

import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import Link from "next/link";
import styles from "@/shared/styles/dropdown-menu.module.css";

export type DropdownMenuItem = | {
    type: "link";
    label: string;
    href: string;
    icon?: ReactNode;
    danger?: boolean;
    disabled?: boolean
} | {
    type: "action";
    label: string;
    action: () => void | Promise<void>;
    icon?: ReactNode;
    danger?: boolean;
    disabled?: boolean
} | {
    type: "divider"
} | {
    type: "header"; label: string
};

type DropdownMenuProps = {
    trigger: ReactNode;
    items: DropdownMenuItem[];
    align?: "start" | "end";
};

export function DropdownMenu({trigger, items, align = "end"}: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <div className={styles.dropdown} ref={containerRef}>
            <button type="button"
                    className={styles.dropdownToggle}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen((prev) => !prev)}>
                {trigger}
            </button>

            {open && (
                <ul role="menu"
                    className={`${styles.dropdownMenu} ${align === "start"
                        ? styles.dropdownMenuStart
                        : styles.dropdownMenuEnd}`}>

                    {items.map((item, index) => {
                        if (item.type === "divider") {
                            return <li key={index} role="separator" className={styles.dropdownDivider}/>;
                        }

                        if (item.type === "header") {
                            return <li key={index} className={styles.dropdownHeader}>{item.label}</li>;
                        }

                        const itemClass = `${styles.dropdownItem} ${item.danger
                            ? styles.dropdownItemDanger
                            : ""} ${item.disabled ? styles.dropdownItemDisabled : ""}`;

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