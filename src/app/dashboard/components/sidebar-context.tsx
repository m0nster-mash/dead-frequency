"use client";

import {createContext, useContext, useState, type ReactNode} from "react";

type SidebarContextValue = {
    collapsed: boolean;
    toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({children}: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
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