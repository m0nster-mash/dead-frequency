"use client";

import {ThemeProvider as NextThemesProvider} from "next-themes";
import {JSX, ReactNode} from "react";

/**
 * A Client Component context provider that facilitates theme management across the application.
 *
 * @param {Object} props - The component properties
 * @param {ReactNode} props.children - Child nodes to be injected inside the style configuration loop
 *
 * @returns {JSX.Element} The visual contextual branding node wrapper
 */
export function ThemeProvider({children}: { children: ReactNode }): JSX.Element {
    return (
        /*
           Configures attribute mapping to use standard CSS classes.
           Defaults configuration structures to read standard OS media choices first.
        */
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}
