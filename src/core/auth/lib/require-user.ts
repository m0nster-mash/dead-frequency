import { auth } from "@/core/auth/lib/auth";
import { getUserRoles } from "./get-user-roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Options for {@link requireUser}.
 */
interface RequireUserOptions {
    role?: "admin" | "moderator" | "member";
}

/**
 * Validates the active user session and returns the user object with assigned roles.
 * Redirects to /login if unauthenticated, or /dashboard if lacking required role.
 */
export async function requireUser(options?: RequireUserOptions) {
    // BetterAuth uses auth.api.getSession(), not auth.api.getUser()
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch assigned roles from the user_role junction table
    const userRoles = await getUserRoles(session.user.id);

    // Enforce role-based access control if specified
    if (options?.role) {
        const hasRole = options.role === "moderator"
            ? userRoles.includes("moderator") || userRoles.includes("admin")
            : userRoles.includes(options.role);

        if (!hasRole) {
            redirect("/dashboard");
        }
    }

    return {
        ...session.user,
        roles: userRoles,
    };
}
