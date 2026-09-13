"use client";

import {createContext, JSX, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";

/**
 * Registry structure tracking dynamic segment slug string mappings to clean text titles.
 */
type LabelMap = Record<string, string>;

/**
 * Internal React context tracking breadcrumb display name dictionary parameters. Initializes as `null` to enforce
 * strict provider validation checks across execution pipelines.
 */
const BreadcrumbLabelsContext = createContext<{
    labels: LabelMap;
    setLabel: (segment: string, label: string) => void;
    clearLabel: (segment: string) => void;
} | null>(null);

/**
 * A Client Component context provider that facilitates runtime breadcrumb dictionary tracking.
 *
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - Child UI elements nested inside the tracking boundary frame.
 *
 * @returns {JSX.Element} The visual contextual branding node wrapper.
 */
export function BreadcrumbsProvider({children}: { children: ReactNode }): JSX.Element {
    const [labels, setLabels] = useState<LabelMap>({});

    /**
     * Registers or updates a human-readable display string matching a specific route slug parameter. Incorporates
     * value alignment checks to protect downstream hooks from infinite re-render loops.
     */
    const setLabel = useCallback((segment: string, label: string) => {
        setLabels((prev) => (prev[segment] === label ? prev : {...prev, [segment]: label}));
    }, []);

    /**
     * Evicts structural mapping tracks from local dictionary maps to clear out dead data parameters.
     */
    const clearLabel = useCallback((segment: string) => {
        setLabels((prev) => {
            if (!(segment in prev)) return prev;
            const next = {...prev};
            delete next[segment];
            return next;
        });
    }, []);

    // Memorizes value signatures to prevent subtree re-renders unless reference variables drift
    const value = useMemo(() =>
        ({labels, setLabel, clearLabel}), [labels, setLabel, clearLabel]);

    return (
        <BreadcrumbLabelsContext.Provider value={value}>
            {children}
        </BreadcrumbLabelsContext.Provider>
    );
}

/**
 * Custom React hook that accesses the core breadcrumb label dictionary store.
 *
 * @throws {Error} If called outside an active structural `BreadcrumbsProvider` wrapper.
 */
export function useBreadcrumbLabels() {
    const ctx = useContext(BreadcrumbLabelsContext);
    if (!ctx) throw new Error("useBreadcrumbLabels must be used within a BreadcrumbsProvider");
    return ctx;
}

/**
 * Specialized lifecycle hook designed to declarative anchor a custom string label to an active route segment slug.
 *
 * @param {string | undefined} segment - The dynamic route path slug token currently being modified.
 * @param {string | undefined} label - The clean text name to inject into visual navigation trails.
 */
export function useBreadcrumbLabel(segment: string | undefined, label: string | undefined) {
    const {setLabel, clearLabel} = useBreadcrumbLabels();

    useEffect(() => {
        // Skips lookup alterations if inputs resolve as falsy flags
        if (!segment || !label) return;

        // Commits the translation string map into the centralized context repository
        setLabel(segment, label);

        // Safely evicts the trace once the calling page dismounts
        return () => clearLabel(segment);
    }, [segment, label, setLabel, clearLabel]);
}
