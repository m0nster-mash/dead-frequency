import {adminClient} from "better-auth/client/plugins";
import {createAuthClient} from "better-auth/react";

/**
 * Centrally managed client-side authorization and SDK instance. Facilitates asynchronous communication with the
 * authentication server framework directly from client components.
 */
export const authClient = createAuthClient({
    // Sets the tracking target URL path, verifying environment configurations during production compilation steps
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

    // Pluggable client logic blocks mimicking capabilities configured inside backend auth engines
    plugins: [
        /**
         *  Exposes secure methods like `authClient.admin.updateUser` and `authClient.admin.setRole` to form layers
         *  and dashboard management grids.
         */
        adminClient()
    ]
});
