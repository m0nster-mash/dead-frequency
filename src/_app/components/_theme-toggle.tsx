"use client";

import {useTheme} from "next-themes";
import {JSX, useSyncExternalStore} from "react";

const emptySubscribe = () => () => {
};

/**
 * An interactive button that allows users to toggle the application's visual theme.
 *
 * @returns {JSX.Element | null} The theme control toggle button, or null if executing inside a server rendering step.
 */
export function _themeToggle(): JSX.Element | null {
    const {theme, setTheme} = useTheme();

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    if (!mounted) {
        return null;
    }

    return (
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme">
            {theme === "dark" ? "light" : "dark"}
        </button>
    );
}
