import * as schema from "@/core/auth/schema/auth.schema";
import {db} from "@/shared/db/client";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";
import {admin, anonymous} from "better-auth/plugins";

/**
 * System-wide central authentication and authorization service instance config. Encapsulates the execution engines
 * for identity handling, token controls, and permission matrices.
 */
export const auth = betterAuth({
    // Pairs persistence mapping utilities to target structural schema files
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),

    // Core identity verification strategies tracking engine
    emailAndPassword: {
        enabled: true,
    },

    // Custom workflow configurations regulating personal profile identity parameters
    user: {
        changeEmail: {
            enabled: true,
            // Optimization rule allowing immediate changes without running complex verification loops
            updateEmailWithoutVerification: true
        },
    },

    // Environmental orchestration secret strings and URL tracking endpoints
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,

    // Pluggable logic blocks extending the capabilities of the core library engine
    plugins: [
        /**
         *  Sets basic role names and groups used globally across server layouts. Locks default access thresholds down
         *  to baseline "user" clearance blocks.
         */
        admin({
            defaultRole: "user",
            adminRoles: ["admin"]
        }),
        /**
         *  Maintains short-term guest identity states before permanent account generation.
         */
        anonymous()
    ]
});
