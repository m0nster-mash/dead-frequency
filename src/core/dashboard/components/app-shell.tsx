import type {ReactNode} from "react";
import {SidebarProvider} from "@/app/dashboard/components/sidebar-context";
import AppShellFrame from "./app-shell-frame";
import {Sidebar} from "@/core";
import Header from "./header";

type AppShellProps = {
    children: ReactNode;
    userName?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
};

export function AppShell({children, userName, userEmail, userRole}: AppShellProps) {
    return (
        <SidebarProvider>
            <AppShellFrame sidebar={<Sidebar/>} header={<Header/>}>
                {children}
            </AppShellFrame>
        </SidebarProvider>
    );
}