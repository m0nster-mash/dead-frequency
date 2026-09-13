import "@/app/globals.css";
import AppShellFrame from "@/core/dashboard/components/app-shell-frame";
import Sidebar from "@/core/dashboard/components/sidebar";
import Header from "@/core/dashboard/components/header";
import { SidebarNav } from "@/app/dashboard/components/sidebar-nav";
import { buildDynamicSidebarNav } from "@/core/registry/lib/module-loader";
import { ThemeProvider } from "@/app/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const navSections = buildDynamicSidebarNav();

    return (
        <html lang="en">
        <body>
        <ThemeProvider>
            <AppShellFrame
                sidebar={
                    <Sidebar>
                        <SidebarNav sections={navSections} />
                    </Sidebar>
                }
                header={<Header />}
            >
                {children}
            </AppShellFrame>
        </ThemeProvider>
        </body>
        </html>
    );
}
