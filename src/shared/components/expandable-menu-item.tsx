"use client";

import Link from "next/link";
import {ReactNode, useState} from "react";

export type MenuLink = {
    label: string;
    href: string;
};

type ExpandableMenuItemProps = {
    label: string;
    icon?: ReactNode;
    links: MenuLink[];
    defaultOpen?: boolean;
};

export default function ExpandableMenuItem({
                                               label,
                                               icon,
                                               links,
                                               defaultOpen = false,
                                           }: ExpandableMenuItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="w-full">
            <button type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
        <span className="flex items-center gap-3">
          {icon && <span>{icon}</span>}
            <span>{label}</span>
        </span>

                <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown links */}
            {isOpen && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
