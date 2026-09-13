import { getEnabledModules } from "../modules.config";
import type { NavSection, NavItem } from "@/app/dashboard/components/sidebar-nav";

export function buildDynamicSidebarNav(): NavSection[] {
    const enabledModules = getEnabledModules();

    const featureItems: NavItem[] = enabledModules.map((module) => {
        if (module.subRoutes && module.subRoutes.length > 0) {
            return {
                type: "expandable",
                label: module.name,
                icon: module.icon || "default-icon",
                links: module.subRoutes,
            };
        }
        return {
            type: "link",
            href: module.route,
            label: module.name,
            icon: module.icon || "default-icon",
        };
    });

    return [
        {
            title: "Core System",
            items: [{ type: "link", href: "/dashboard", label: "Dashboard", icon: "dashboard-icon" }],
        },
        {
            title: "Active Modules",
            items: featureItems,
        },
        {
            title: "Account & Admin",
            items: [
                { type: "link", href: "/settings", label: "Settings", icon: "gear-icon" },
                { type: "link", href: "/admin", label: "Admin Panel", icon: "shield-icon" },
            ],
        },
    ];
}
