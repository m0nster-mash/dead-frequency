import {relations} from "drizzle-orm";
import {jsonb, pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/core/auth/schema/auth.schema";
import {AvatarConfig} from "@/feature/avatar/lib/types";

export const avatarConfig =
    pgTable("avatar_config", {
        userId: text("user_id")
            .primaryKey()
            .references(() => user.id, {onDelete: "cascade"}),
        config: jsonb("config")
            .$type<AvatarConfig>(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    });

export const avatarConfigRelations = relations(avatarConfig, ({one}) => ({
    user: one(user, {
        fields: [avatarConfig.userId],
        references: [user.id],
    }),
}));