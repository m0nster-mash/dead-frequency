import {auth} from "@/core/auth";
import {notFound} from "next/navigation";

/**
 * Options for {@link requireUser}.
 *
 * @property {Headers} headers - Headers to forward to the auth API (typically the incoming request headers).
 * @property {string} context - label used to identify the calling route/context in error logs. Defaults to
 *                              "requireUser" if omitted.
 */
type RequireUserOptions = {
    headers: Headers;
    context?: string;
};

/**
 * Fetches account details for a given user ID and guarantees a 404 response (via `notFound()`) if the user cannot
 * be found or the lookup fails for any reason.
 *
 * Intended to replace manual try/catch + not-found boilerplate in admin or profile routes that fetch a target user
 * by ID.
 *
 * @param userId - The ID of the user to fetch.
 * @param options - Headers to forward and an optional logging context. See {@link RequireUserOptions}.
 */
export async function requireUser(userId: string, options: RequireUserOptions) {
    const {headers: requestHeaders, context = "requireUser"} = options;
    let user;

    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error(`[${context}] getUser threw:`, error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    return user; // TS knows user is non-null past this point
}
