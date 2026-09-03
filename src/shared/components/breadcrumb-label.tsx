"use client";

import {useBreadcrumbLabel} from "@shared/components/breadcrumbs-context";

/**
 * Properties for the BreadcrumbLabel component.
 * @typedef {Object} BreadcrumbLabelProps
 * @property {string} segment - The dynamic URL route slug segment string matching the active route path parameter.
 * @property {string | undefined} label - The human-readable string text label to override the default cryptic URL slug.
 */
type BreadcrumbLabelProps = {
    segment: string;
    label: string | undefined;
};

/**
 * A declarative utility component that injects a custom display string into the breadcrumbs context trail.
 *
 * Technical processing context:
 * 1. Intended to be dropped into Server or Client page templates to assign human-readable labels to dynamic route slugs.
 * 2. Uses a custom side-effect hook to dynamically register or update text strings within the context provider dictionary map.
 * 3. Render behavior: Operates strictly as a functional side-effect vehicle; it returns a null node placeholder to keep visual layouts completely unaffected.
 *
 * @param {BreadcrumbLabelProps} props - The component properties.
 * @returns {null} Returns null to safely bypass HTML document generation paths.
 */
export function BreadcrumbLabel({segment, label}: BreadcrumbLabelProps) {
    // Registers the dynamic text override within the central layout breadcrumb state manager
    useBreadcrumbLabel(segment, label);

    return null;
}
