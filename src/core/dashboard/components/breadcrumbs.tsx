"use client";

import {useBreadcrumbLabels} from "@/shared/components/breadcrumbs-context";
import breadcrumbStyles from "@/shared/styles/patterns/breadcrumbs.module.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {JSX} from "react";

/**
 * An interactive Client Component that parses the browser path routing location to render dynamic navigational
 * breadcrumb paths.
 */
export default function _breadcrumbs(): JSX.Element {
    const pathname = usePathname();
    const {labels} = useBreadcrumbLabels();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <nav className={breadcrumbStyles.breadcrumbs} aria-label="Breadcrumb">
            <Link className={breadcrumbStyles.home} href="/"> Home </Link>

            {segments.map((segment, index) => {
                // Cuts the original segment sequence up to the active depth index to build the valid pathway target
                const href = "/" + segments.slice(0, index + 1).join("/");

                // Fallback - merges contextual string maps, fallback-parsing uri text strings if missing
                const label = labels[segment] ?? decodeURIComponent(segment);

                // Evaluates if the current step indicates the actual page terminal destination block
                const isLast = index === segments.length - 1;

                return (
                    <span className={breadcrumbStyles.item} key={segment}>
                        <span className={breadcrumbStyles.separator} aria-hidden="true">
                            {" "} / {" "}
                        </span>

                        {isLast ? (
                            /**
                             * Binds aria-current attributes to signal screen reading engines that this item
                             * represents the visitor's current active structural location context on the site map.
                             **/
                            <span className={breadcrumbStyles.current} aria-current="page">
                                [ {label} ]
                            </span>
                        ) : (
                            <Link className={breadcrumbStyles.link} href={href}>
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
