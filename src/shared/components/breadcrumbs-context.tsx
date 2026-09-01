"use client";

import {createContext, useContext, useEffect, useMemo, useState, ReactNode} from "react";

type LabelMap = Record<string, string>;

const BreadcrumbLabelsContext = createContext<{
    labels: LabelMap;
    setLabel: (segment: string, label: string) => void;
    clearLabel: (segment: string) => void;
} | null>(null);

export function BreadcrumbsProvider({children}: { children: ReactNode }) {
    const [labels, setLabels] = useState<LabelMap>({});

    const setLabel = (segment: string, label: string) => {
        setLabels((prev) => (prev[segment] === label ? prev : {...prev, [segment]: label}));
    };

    const clearLabel = (segment: string) => {
        setLabels((prev) => {
            if (!(segment in prev)) return prev;
            const next = {...prev};
            delete next[segment];
            return next;
        });
    };

    const value = useMemo(() => ({labels, setLabel, clearLabel}), [labels]);

    return (
        <BreadcrumbLabelsContext.Provider value={value}>
            {children}
        </BreadcrumbLabelsContext.Provider>
    );
}

export function useBreadcrumbLabels() {
    const ctx = useContext(BreadcrumbLabelsContext);
    if (!ctx) throw new Error("useBreadcrumbLabels must be used within a BreadcrumbsProvider");
    return ctx;
}

export function useBreadcrumbLabel(segment: string | undefined, label: string | undefined) {
    const {setLabel, clearLabel} = useBreadcrumbLabels();

    useEffect(() => {
        if (!segment || !label) return;
        setLabel(segment, label);
        return () => clearLabel(segment);
    }, [segment, label]);
}