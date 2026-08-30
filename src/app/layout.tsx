import type {Metadata} from "next";
import "./globals.css";
import {AppShell} from "@/core/dashboard/components/app-shell";
import {ThemeProvider} from "@/app/components/theme-provider"
import React, {ReactNode} from "react";

export const metadata: Metadata = {
    title: "dead-frequency",
};

export default function RootLayout({children, auth}: { children: ReactNode, auth: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider>
            <AppShell>
                {children}
                {auth}
            </AppShell>
        </ThemeProvider>
        </body>
        </html>
    );
}