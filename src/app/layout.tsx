import type {Metadata} from "next";
import "./globals.css";
import {AppShell} from "@/core/dashboard/components/app-shell";
import {ThemeProvider} from "@/app/components/theme-provider"
import React, {ReactNode} from "react";

export const metadata: Metadata = {
    title: "dead-frequency",
};

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <AppShell>{children}</AppShell>
        </ThemeProvider>
        </body>
        </html>
    );
}