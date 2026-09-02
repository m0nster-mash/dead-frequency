"use client";

import {useSidebar} from "@/app/dashboard/components/sidebar-context";
import styles from "@shared/styles/dashboard.module.css";
import {CSSProperties, JSX, ReactNode} from "react";

/**
 * Properties for the AppShellFrame component.
 *
 * @property {ReactNode} sidebar - The side drawer navigation viewport layout.
 * @property {ReactNode} header - The top toolbar panel containing search tools, indicators, and profile buttons.
 * @property {ReactNode} children - Dynamic view content streams rendered within the core main workspace block.
 */
type AppShellFrameProps = {
    sidebar: ReactNode;
    header: ReactNode;
    children: ReactNode;
};

/**
 * A Client Component frame orchestrating the spatial grid coordinates of the workspace.
 *
 * @param {AppShellFrameProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual structural wrapper organizing side navigation blocks and main viewport containers.
 */
export default function AppShellFrame({sidebar, header, children}: AppShellFrameProps): JSX.Element {
    const {collapsed} = useSidebar();

    /*
       Dynamic Style Block:
       Translates reactive layout parameters straight into global token definitions.
       This avoids constant inline re-renders by letting standard CSS variables manage column resizing.
    */
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
                <main className={styles.appContent}>
                    <div id="top">{children}</div>
                </main>
            </div>
        </div>
    );
}
