"use client";

/**
 * Properties for the BreadcrumbLabel component.
 *
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
 * @param {BreadcrumbLabelProps} props - The component properties.
 *
 * @returns {null} Returns null to safely bypass HTML document generation paths.
 */
export function BreadcrumbLabel({segment, label}: BreadcrumbLabelProps): null {
    // Registers the dynamic text override within the central layout breadcrumb state manager
    useBreadcrumbLabel(segment, label);

    return null;
}
