"use client";

import type {CSSProperties, ReactNode} from "react";
import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@shared/styles/dashboard.module.css";

type AppShellFrameProps = {
    sidebar: ReactNode;
    header: ReactNode;
    children: ReactNode;
};

export default function AppShellFrame({sidebar, header, children}: AppShellFrameProps) {
    const {collapsed} = useSidebar();

    const shellStyle = {
        "--current-sidebar-width": collapsed
            ? "var(--sidebar-collapsed-width)"
            : "var(--sidebar-width)",
    } as CSSProperties;

    return (
        <div className="app" style={shellStyle}>
            {sidebar}
            <div className={styles.mainShell}>
                {header}
                <main className={styles.appContent}>{children}</main>
            </div>
        </div>
    );
}