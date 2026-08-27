"use client";

import {useState, type CSSProperties, ReactNode} from "react";
import Sidebar from "./sidebar";
import Header from "./header";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({children}: AppShellProps) {
    const [collapsed, setCollapsed] = useState(false);

    const shellStyle = {
        "--current-sidebar-width": collapsed
            ? "var(--sidebar-collapsed-width)"
            : "var(--sidebar-width)",
    } as CSSProperties;

    return (
        <div className="app" style={shellStyle}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)}/>
            <div className="main-shell">
                <Header/>
                <main className="app-content">{children}</main>
            </div>
        </div>
    );
}