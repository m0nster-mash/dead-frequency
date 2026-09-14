import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/shared/db/client";
import * as schema from "../schema/auth.schema";
import { userRole } from "../schema/auth.schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.insert(userRole).values({
                        userId: user.id,
                        roleId: "user",
                    });
                },
            },
        },
    },
});
