"use client";

import {createContext, JSX, type ReactNode, useContext, useEffect, useState} from "react";

/**
 * Value shape exposed by the SidebarContext.
 *
 * @property {boolean} collapsed - Indicates whether the sidebar interface is minimized
 * @property {() => void} toggle - State modifier function that flips the collapse flag
 */
type SidebarContextValue = {
    collapsed: boolean;
    toggle: () => void;
};

/**
 * Underlying React context object for the sidebar state. Initializes as `null` to enforce mandatory provider
 * validation wraps.
 */
const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * LocalStorage sync key matching localized sidebar configuration.
 */
const STORAGE_KEY = "dead-frequency:sidebar-collapsed";

/**
 * Reads the persistence layer from the browser's storage window to determine initial state configurations.
 * Safe for SSR environments; defaults to false if window objects do not exist or threw errors.
 *
 * @returns {boolean} True if the layout context was previously saved as collapsed
 */
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

/**
 * A Client Component context provider that facilitates responsive sidebar scaling across layouts.
 *
 * Technical feature flow:
 * 1. Lazy-initializes the state flag by checking local browser cookies/storage rules first.
 * 2. Side effect persistence: Syncs state adjustments back down to localStorage whenever state changes.
 * 3. Cross-tab sync: Automatically updates state variables if the user flips preferences inside secondary open browser
 * tabs.
 *
 * @param {Object} props - The component properties
 * @param {ReactNode} props.children - Child UI layers nested inside the sidebar structural toggle loop
 *
 * @returns {JSX.Element} The visual contextual boundary node wrapper
 */
export function SidebarProvider({children}: { children: ReactNode }): JSX.Element {
    const [collapsed, setCollapsed] = useState<boolean>(readStoredCollapsed);

    // Synchronizes localized memory changes down to the browser storage mechanism
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, String(collapsed));
        } catch {
            // no-op fallback to handle hidden private mode sandboxes
        }
    }, [collapsed]);

    // Cross-Tab Listener: Ensures multiple open instances sync layout states in real-time
    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key === STORAGE_KEY && event.newValue !== null) {
                setCollapsed(event.newValue === "true");
            }
        }

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Encapsulated state modifier dispatch handle
    const toggle = () => setCollapsed((v) => !v);

    return (
        <SidebarContext.Provider value={{collapsed, toggle}}>
            {children}
        </SidebarContext.Provider>
    );
}

/**
 * Custom React hook that hooks into active sidebar control dimensions. Includes strict validation checks to catch
 * runtime reference errors during layout assembly phases.
 *
 * @throws {Error} If called outside an active structural `SidebarProvider` hierarchy loop
 *
 * @returns {SidebarContextValue} Active context flags containing current layout properties and state utilities
 */
export function useSidebar(): SidebarContextValue {
    const ctx = useContext(SidebarContext);
    if (!ctx) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return ctx;
}
