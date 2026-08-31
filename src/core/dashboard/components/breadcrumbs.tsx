"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from "@shared/styles/dashboard.module.css";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link className={styles.home} href="/">
                Home
            </Link>

            {segments.map((segment, index) => {
                const href = "/" + segments.slice(0, index + 1).join("/");
                const label = decodeURIComponent(segment);
                const isLast = index === segments.length - 1;

                return (
                    <span className={styles.item} key={segment}>
                    <span className={styles.separator} aria-hidden="true">
                        /
                    </span>
                        {isLast ? (
                            <span
                                className={styles.current}
                                aria-current="page">
                            [ {label} ]
                        </span>
                        ) : (
                            <Link className={styles.link} href={href}>
                                {label}
                            </Link>
                        )}
                </span>
                );
            })}
        </nav>
    );
}