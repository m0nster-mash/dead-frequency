import {_themeProvider} from "@/_app/components/_theme-provider";
import {AppShell} from "@/_core/dashboard/components/app-shell";
import {BreadcrumbsProvider} from "@/_shared/components/breadcrumbs-context";
import type {Metadata} from "next";
import "./globals.css";
import React, {JSX, ReactNode} from "react";

/**
 * Global application metadata dictionary configuration for Next.js. Controls the fallback document head tags, site
 * indexing signatures, and default titles.
 */
export const metadata: Metadata = {
    title: "dead-frequency",
};

/**
 * The core architectural Next.js Root Layout component that wraps the entire HTML document tree.
 *
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - Dynamic view page streams injected into the layout framework.
 *
 * @returns {JSX.Element} The foundational framework layout container wrapping the application ecosystem.
 */
export default function RootLayout({children}: { children: ReactNode }): JSX.Element {
    return (
        /**
         * suppressHydrationWarning is mandatory on the root html element when using theme providers. It tells Next.js
         * not to flag light/dark class mismatches caused by theme synchronization scripts.
         */
        <html lang="en" suppressHydrationWarning>
        <body>
        <_themeProvider>
            <BreadcrumbsProvider>
                <AppShell>{children}</AppShell>
            </BreadcrumbsProvider>
        </_themeProvider>
        </body>
        </html>
    );
}
