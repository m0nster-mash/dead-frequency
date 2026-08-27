import type { ReactNode } from "react";
import { SidebarProvider } from "./sidebar-context";
import AppShellFrame from "./app-shell-frame";
import Sidebar from "./sidebar";
import Header from "./header";

type AppShellProps = {
    children: ReactNode;
};

// This stays a Server Component. It never uses hooks itself — it just
// composes Server Components (Sidebar, Header) and hands them to the
// Client Component (AppShellFrame) as props/children, so they never
// get pulled into the client bundle.
export default function AppShell({ children }: AppShellProps) {
    return (
        <SidebarProvider>
            <AppShellFrame sidebar={<Sidebar />} header={<Header />}>
                {children}
            </AppShellFrame>
        </SidebarProvider>
    );
}