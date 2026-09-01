"use client";

import {createContext, useContext, useEffect, useState, type ReactNode} from "react";

type SidebarContextValue = {
    collapsed: boolean;
    toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "dead-frequency:sidebar-collapsed";

function readStoredCollapsed(): boolean {
    if (typeof window === "undefined") {
        return false;
    }
    try {
        return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

export function SidebarProvider({children}: { children: ReactNode }) {

    const [collapsed, setCollapsed] = useState<boolean>(readStoredCollapsed);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, String(collapsed));
        } catch {
            // no-op
        }
    }, [collapsed]);

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key === STORAGE_KEY && event.newValue !== null) {
                setCollapsed(event.newValue === "true");
            }
        }

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const toggle = () => setCollapsed((v) => !v);

    return (
        <SidebarContext.Provider value={{collapsed, toggle}}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return ctx;
}