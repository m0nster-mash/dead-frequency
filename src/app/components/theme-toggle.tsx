"use client";

import {useTheme} from "next-themes";
import {JSX, useEffect, useState} from "react";

/**
 * An interactive Client Component button that allows users to toggle the application's visual theme.
 *
 * @returns {JSX.Element | null} The theme control toggle button, or null if executing inside a server rendering step
 */
export function ThemeToggle(): JSX.Element | null {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    // Hydration Gate: Flips mounted flags immediately following target layout paints on the browser window
    useEffect(() => setMounted(true), []);

    // Prevents server-rendered HTML from diverging from client states (ex. mismatching button inner text)
    if (!mounted) {
        return null;
    }

    return (
        /*
           Toggles application style rules by evaluating state contexts.
           Includes explicit accessibility attributes to support keyboard and screen readers.
        */
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme">
            {theme === "dark" ? "light" : "dark"}
        </button>
    );
}
