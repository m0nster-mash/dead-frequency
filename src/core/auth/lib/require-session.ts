"use server";

import {auth} from "@core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

/**
 * Options for {@link requireSession}.
 *
 * @property {string | string[]} role - Role(s) the authenticated user must have to access the route. Accepts a single
 *                                      role or an array of allowed roles (matched with OR logic). If omitted, only a
 *                                      valid session is required; no role check is performed.
 * @property {string} loginRedirect - Path to redirect to when there is no authenticated session. @default "/login"
 * @property {string} forbiddenRedirect - Path to redirect to when the user is authenticated but does not have one of
 *                                        the required roles. @default "/"
 */
type RequireSessionOptions = {
    role?: string | string[];
    loginRedirect?: string;
    forbiddenRedirect?: string;
};

/**
 * Ensures the current request has a valid, authenticated session and, optionally, that the user holds one of the
 * required roles.
 *
 * Intended to be called at the top of server components, layouts, or route handlers in place of manual session/role
 * checks. Redirects are performed as a side effect via `next/navigation`'s `redirect()`, which throws. Any code after
 * a failed check will not execute.
 *
 * @param options - Configuration for the session and role checks. See {@link RequireSessionOptions}.
 *
 * @returns The authenticated session, with `session.user` guaranteed to be defined.
 */
export async function requireSession(options: RequireSessionOptions = {}) {
    const {
        role,
        loginRedirect = "/login",
        forbiddenRedirect = "/",
    } = options;

    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user) {
        redirect(loginRedirect);
    }

    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!session.user.role || !allowedRoles.includes(session.user.role)) {
            redirect(forbiddenRedirect);
        }
    }

    return session; // TS knows session.user is non-null past this point
}
