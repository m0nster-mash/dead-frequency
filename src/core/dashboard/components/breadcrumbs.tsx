"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav aria-label="Breadcrumb">
            <Link href="/"> Home </Link>

            {segments.map((segment, index) => {
                const href = "/" + segments.slice(0, index + 1).join("/");
                const label = decodeURIComponent(segment);
                const isLast = index === segments.length - 1;

                return (
                    <span id="breadcrumbs">
                        <span aria-hidden="true">/</span>
                        {isLast ? (
                            <span aria-current="page"> {label} </span>
                        ) : (
                            <Link href={href}> {label} </Link>
                        )}
                    </span>);
            })}
        </nav>
    );
}