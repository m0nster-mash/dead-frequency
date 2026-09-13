import {SidebarProvider} from "@/app/dashboard/components/sidebar-context";
import {Sidebar} from "@/core";
import {JSX, ReactNode} from "react";
import AppShellFrame from "./app-shell-frame";
import Header from "./header";

/**
 * Properties for the AppShell component.
 *
 * @property {ReactNode} children - Dynamic view page content stream injected inside the main viewport workspace.
 * @property {string | null} [userName] - Optional display name of the currently authenticated session user.
 * @property {string | null} [userEmail] - Optional primary email address of the currently authenticated session user.
 * @property {string | null} [userRole] - Optional authorization role or permission flag of the current session user.
 */
type AppShellProps = {
    children: ReactNode;
    userName?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
};

/**
 * A central layout wrapper component that initializes global client contexts and frames the dashboard viewport.
 *
 * @param {AppShellProps} props - The component properties.
 * @returns {JSX.Element} The visual foundation shell wrapper grid container.
 */
export function AppShell({children}: AppShellProps): JSX.Element {
    return (
        <SidebarProvider>
            {/* Accepts decoupled visual layouts as explicit properties to clean up complex structural nesting hierarchies. */}
            <AppShellFrame sidebar={<Sidebar/>} header={<Header/>}>
                {children}
            </AppShellFrame>
        </SidebarProvider>
    );
}
