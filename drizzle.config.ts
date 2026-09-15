import "dotenv/config";
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    schema: [
        // "./src/core/auth/schema/auth.schema.ts",
        // "./src/core/character/schema/character.schema.ts",
        // "./src/shared/communication/moderation/schema/moderation.schema.ts",
        // "./packages/feature-chatbox/src/schema/chatbox.schema.ts",
        // "./packages/feature-avatar/src/schema/avatar.schema.ts",
        // "./packages/feature-forum/src/schema/forum.schema.ts",
        "./src/**/*.schema.ts",
        "./src/shared/db/system-modules.ts", // Explicitly include system-modules.ts
        "./packages/**/*.schema.ts",          // Include feature packages!
    ],
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
