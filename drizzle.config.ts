import "dotenv/config";
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    schema: [
        "./src/core/auth/schema/auth.schema.ts",
        "./src/core/character/schema/character.schema.ts",
        "./src/shared/communication/moderation/schema/moderation.schema.ts",
        "./packages/feature-chatbox/src/schema/chatbox.schema.ts",
        "./packages/feature-avatar/src/schema/avatar.schema.ts",
        "./packages/feature-forum/src/schema/forum.schema.ts",
    ],
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
    },
});
