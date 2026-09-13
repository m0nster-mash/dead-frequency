import { auth } from "@/core/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type RequireSessionOptions = {
    role?: string | string[];
    loginRedirect?: string;
    forbiddenRedirect?: string;
};

export async function requireSession(options: RequireSessionOptions = {}) {
    const { role, loginRedirect = "/login", forbiddenRedirect = "/" } = options;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect(loginRedirect);
    }

    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!session.user.role || !allowedRoles.includes(session.user.role)) {
            redirect(forbiddenRedirect);
        }
    }

    return session;
}
