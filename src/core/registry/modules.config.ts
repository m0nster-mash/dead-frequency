export interface ModuleDefinition {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    route: string;
    icon?: string;
    subRoutes?: { href: string; label: string }[];
    requiredRoles?: string[];
}

/**
 * Central Host Module Registry
 * Toggle modules on or off by setting `enabled: true | false`.
 */
export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
    chatbox: {
        id: "chatbox",
        name: "Chatbox",
        description: "Real-time floating and panel chat interface",
        enabled: true,
        route: "/chatbox",
        icon: "bootstrap-chat-icon",
    },
    avatar: {
        id: "avatar",
        name: "Avatar Builder",
        description: "Custom SVG avatar generator",
        enabled: true,
        route: "/avatar",
        icon: "bootstrap-person-icon",
    },
    forum: {
        id: "forum",
        name: "Community Forum",
        description: "Categorized discussion boards and threads",
        enabled: true,
        route: "/forum",
        icon: "bootstrap-forum-icon",
        subRoutes: [{href: "/forum", label: "All Boards"}],
    },
};

export function getEnabledModules(): ModuleDefinition[] {
    return Object.values(MODULE_REGISTRY).filter((module) => module.enabled);
}
