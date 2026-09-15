import {auth} from "@/core/auth/lib/auth";
import {requireRoles} from "@/core/auth/lib/require-roles";
import {UserRole} from "@shared/constants";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

interface RequireSessionOptions {
    role?: UserRole;
}

export async function requireSession(options?: RequireSessionOptions) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const userRoles = await requireRoles(session.user.id);

    if (options?.role) {
        const hasRole = options.role === UserRole.MODERATOR
            ? userRoles.includes(UserRole.MODERATOR) || userRoles.includes(UserRole.ADMIN)
            : userRoles.includes(options.role);

        if (!hasRole) {
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
