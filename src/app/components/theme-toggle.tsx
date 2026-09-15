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
export function ThemeToggle(): JSX.Element | null {
    const {theme, setTheme} = useTheme();
    const LIGHT = "light";
    const DARK = "dark";

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    if (!mounted) {
        return null;
    }

    return (
        <button onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
                aria-label="Toggle theme">
            {theme === DARK ? LIGHT : DARK}
        </button>
    );
}
