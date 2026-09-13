"use client";

import { useSidebar } from "@/app/dashboard/components/sidebar-context";
import sidebarStyles from "@/shared/styles/patterns/sidebar.module.css";
import { CSSProperties, JSX, ReactNode } from "react";

type AppShellFrameProps = {
    sidebar: ReactNode;
    header: ReactNode;
    children: ReactNode;
};

export default function AppShellFrame({ sidebar, header, children }: AppShellFrameProps): JSX.Element {
    const { collapsed } = useSidebar();

    const shellStyle = {
        "--current-sidebar-width": collapsed
            ? "var(--sidebar-collapsed-width)"
            : "var(--sidebar-width)",
    } as CSSProperties;

    return (
        <div className="app" style={shellStyle}>
            {sidebar}
            <div className={sidebarStyles.mainShell}>
                {header}
                <main className={sidebarStyles.appContent}>
                    <div id="top">{children}</div>
                </main>
            </div>
        </div>
    );
}
