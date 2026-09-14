"use client";

import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ReactNode} from "react";

/**
 * A client component that facilitates theme management across the application.
 *
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - Child nodes to be injected inside the style configuration loop.
 */
export function ThemeProvider({children}: { children: ReactNode }) {
    return (
        /**
         *  Configures attribute mapping to use standard CSS classes. Defaults configuration structures to read
         *  standard OS media choices first.
         */
        <NextThemesProvider attribute="class"
                            defaultTheme="system"
                            enableSystem
                            storageKey="theme-preference">
            {children}
        </NextThemesProvider>
    );
}
