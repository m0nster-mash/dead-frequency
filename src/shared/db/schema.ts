import * as avatarSchema from "@/../packages/feature-avatar/src/schema/avatar.schema";
import * as chatboxSchema from "@/../packages/feature-chatbox/src/schema/chatbox.schema";
import * as forumSchema from "@/../packages/feature-forum/src/schema/forum.schema";
import * as authSchema from "@/core/auth/schema/auth.schema";
import * as characterSchema from "@/core/character/schema/character.schema";
import * as moderationSchema from "@/shared/communication/moderation/schema/moderation.schema";

/**
 * Combined Drizzle ORM Schema
 * Dynamically aggregates host core entities and decoupled module schemas.
 */
export const schema = {
    ...authSchema,
    ...characterSchema,
    ...moderationSchema,
    // ...chatboxSchema,
    // ...avatarSchema,
    // ...forumSchema,
};

export default schema;
