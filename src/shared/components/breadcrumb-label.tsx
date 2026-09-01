"use client";

import {useBreadcrumbLabel} from "@shared/components/breadcrumbs-context";

type BreadcrumbLabelProps = {
    segment: string;
    label: string | undefined;
};

export function BreadcrumbLabel({segment, label}: BreadcrumbLabelProps) {
    useBreadcrumbLabel(segment, label);
    return null;
}