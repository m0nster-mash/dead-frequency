export interface ModuleNavItem {
    label: string;
    href: string;
    icon?: string;
}

export interface ModuleConfig {
    /** Unique key identifying the feature package (e.g., 'chatbox', 'forum') */
    key: string;
    /** Display title for admin dashboards and navigation headers */
    name: string;
    /** High-level description of module capabilities */
    description: string;
    /** SemVer version of the linked feature package */
    version: string;
    /** Global toggle state driving shell navigation visibility and route guards */
    isEnabled: boolean;
    /** Primary entry route path hosted by the Next.js app */
    baseRoute: string;
    /** Navigation links rendered in AppShell sidebars and dropdowns when enabled */
    navItems: ModuleNavItem[];
    /** Optional maintenance notice presented when a module is temporarily disabled */
    maintenanceMessage?: string;
}

export type ModuleRegistry = Record<string, ModuleConfig>;

/**
 * Centralized Module Registry
 * Dictates which decoupled feature packages are active in the host runner application.
 */
export const modulesConfig: ModuleRegistry = {
    chatbox: {
        key: "chatbox",
        name: "Portable Shoutbox",
        description: "Embeddable, context-scoped shoutbox widget for site-wide or guild chat.",
        version: "1.0.0",
        isEnabled: true,
        baseRoute: "/test/chatbox",
        navItems: [
            {
                label: "Shoutbox",
                href: "/test/chatbox",
                icon: "bootstrap-chat-icon",
            },
        ],
    },
    avatar: {
        key: "avatar",
        name: "Modular SVG Avatars",
        description: "Layered SVG vector composition engine and interactive avatar builder.",
        version: "1.0.0",
        isEnabled: true,
        baseRoute: "/avatar",
        navItems: [
            {
                label: "Avatar Builder",
                href: "/avatar",
                icon: "bootstrap-person-icon",
            },
        ],
    },
    forum: {
        key: "forum",
        name: "Discussion Forums",
        description: "Hierarchical discussion engine featuring categories, boards, threads, and posts.",
        version: "1.0.0",
        isEnabled: true,
        baseRoute: "/forum",
        navItems: [
            {
                label: "Forums",
                href: "/forum",
                icon: "bootstrap-forum-icon",
            },
        ],
    },
};

/**
 * Evaluates whether a given module key is registered and enabled.
 */
export function isModuleEnabled(moduleKey: string): boolean {
    return Boolean(modulesConfig[moduleKey]?.isEnabled);
}

/**
 * Retrieves all currently enabled module configurations for dynamic navigation rendering.
 */
export function getEnabledModules(): ModuleConfig[] {
    return Object.values(modulesConfig).filter((module) => module.isEnabled);
}

/**
 * Retrieves configuration metadata for a specific module.
 */
export function getModuleConfig(moduleKey: string): ModuleConfig | null {
    return modulesConfig[moduleKey] ?? null;
}
