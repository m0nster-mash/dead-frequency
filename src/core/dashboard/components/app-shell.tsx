import type {ReactNode} from "react";
import {SidebarProvider} from "@/app/dashboard/components/sidebar-context";
import AppShellFrame from "./app-shell-frame";
import Sidebar from "./sidebar";
import Header from "./header";

type AppShellProps = {
    children: ReactNode;
};

export default function AppShell({children}: AppShellProps) {
    return (
        <SidebarProvider>
            <AppShellFrame sidebar={<Sidebar/>} header={<Header/>}>
                {children}
            </AppShellFrame>
        </SidebarProvider>
    );
}