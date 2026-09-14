import {auth} from "@/core/auth/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getUserRoles} from "./get-user-roles";

export async function requireSession(options?: { role?: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Retrieve assigned roles from the user_role table
    const userRoles = await getUserRoles(session.user.id);

    // If a specific role check is required, verify permission
    if (options?.role && !userRoles.includes(options.role)) {
        redirect("/dashboard");
    }

    return {
        ...session,
        user: {
            ...session.user,
            roles: userRoles,
            primaryRole: userRoles || "member",
        },
    };
}
