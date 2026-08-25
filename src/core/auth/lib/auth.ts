import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin, anonymous } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "../db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: true
        },
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"]
        }),
        anonymous()
    ]
});