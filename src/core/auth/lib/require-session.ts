import {auth} from "@/core/auth/lib/auth";
import {requireRoles} from "@/core/auth/lib/require-roles";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

interface RequireSessionOptions {
    role?: "admin" | "moderator" | "user";
}

export async function requireSession(options?: RequireSessionOptions) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch assigned roles from user_role junction table
    const userRoles = await requireRoles(session.user.id);

    if (options?.role) {
        const hasRole = options.role === "moderator"
            ? userRoles.includes("moderator") || userRoles.includes("admin")
            : userRoles.includes(options.role);

        if (!hasRole) {
            // Use redirect("/dashboard") if you don't want unauthorized access to trigger a 404
            redirect("/dashboard");
        }
    }

    return {
        ...session,
        user: {
            ...session.user,
            roles: userRoles,
        },
    };
}
