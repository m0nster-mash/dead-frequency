"use client";

import {createContext, useContext, useEffect, useMemo, useState, ReactNode} from "react";

/**
 * Registry structure tracking dynamic segment slug string mappings to clean text titles.
 * @typedef {Record<string, string>} LabelMap
 */
type LabelMap = Record<string, string>;

/**
 * Internal React context tracking breadcrumb display name dictionary parameters.
 * Initializes as `null` to enforce strict provider validation checks across execution pipelines.
 */
const BreadcrumbLabelsContext = createContext<{
    labels: LabelMap;
    setLabel: (segment: string, label: string) => void;
    clearLabel: (segment: string) => void;
} | null>(null);

/**
 * A Client Component context provider that facilitates runtime breadcrumb dictionary tracking.
 *
 * Technical feature flow:
 * 1. Initializes isolated dictionary state maps tracking active dynamic segment display parameters.
 * 2. Implements granular mutation dispatch operations equipped with value comparison guards to bypass redundant component renders.
 * 3. Binds operation methods into a memoized `useMemo` context envelope tracking updates onto dependency lists.
 *
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - Child UI elements nested inside the tracking boundary frame.
 * @returns {JSX.Element} The visual contextual branding node wrapper.
 */
export function BreadcrumbsProvider({children}: { children: ReactNode }) {
    const [labels, setLabels] = useState<LabelMap>({});

    /**
     * Registers or updates a human-readable display string matching a specific route slug parameter.
     * Incorporates value alignment checks to protect downstream hooks from infinite re-render loops.
     */
    const setLabel = (segment: string, label: string) => {
        setLabels((prev) => (prev[segment] === label ? prev : {...prev, [segment]: label}));
    };

    /**
     * Evicts structural mapping tracks from local dictionary maps to clear out dead data parameters.
     */
    const clearLabel = (segment: string) => {
        setLabels((prev) => {
            if (!(segment in prev)) return prev;
            const next = {...prev};
            delete next[segment];
            return next;
        });
    };

    // Memoizes value signatures to prevent sub-tree re-renders unless reference variables drift
    const value = useMemo(() => ({labels, setLabel, clearLabel}), [labels]);

    return (
        <BreadcrumbLabelsContext.Provider value={value}>
            {children}
        </BreadcrumbLabelsContext.Provider>
    );
}

/**
 * Custom React hook that accesses the core breadcrumb label dictionary store.
 *
 * @throws {Error} If called outside of an active structural `BreadcrumbsProvider` wrapper.
 * @returns {Object} Stored label data maps and state configuration dispatch handlers.
 */
export function useBreadcrumbLabels() {
    const ctx = useContext(BreadcrumbLabelsContext);
    if (!ctx) throw new Error("useBreadcrumbLabels must be used within a BreadcrumbsProvider");
    return ctx;
}

/**
 * Specialized lifecycle hook designed to declarative anchor a custom string label to an active route segment slug.
 *
 * Secure feature flow:
 * 1. Synchronizes text assignments post-render via a targeted side-effect hook loop.
 * 2. Short-circuits execution layers gracefully if parameter values pass as undefined fields.
 * 3. Memory Cleanup: Exposes an explicit component dismount callback function that automatically purges
 *    custom segment names when the layout changes, preventing stale leaks in persistent dashboards.
 *
 * @param {string | undefined} segment - The dynamic route path slug token currently being modified.
 * @param {string | undefined} label - The clean text name to inject into visual navigation trails.
 */
export function useBreadcrumbLabel(segment: string | undefined, label: string | undefined) {
    const {setLabel, clearLabel} = useBreadcrumbLabels();

    useEffect(() => {
        // Validation Guard: Skips lookup alterations if inputs resolve as falsy flags
        if (!segment || !label) return;

        // Commits the translation string map into the centralized context repository
        setLabel(segment, label);

        // Memory Cleanup Lifecycle Callback: Safely evicts the trace once the calling page dismounts
        return () => clearLabel(segment);
    }, [segment, label]);
}
