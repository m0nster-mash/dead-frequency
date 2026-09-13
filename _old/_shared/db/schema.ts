/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Core Schemas
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export * from "@/core/auth/schema/auth.schema";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Feature Schemas
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export * from "@/feature/avatar/schema/avatar.schema";
export * from "@/feature/forum/schema/forum.schema";
export * from "@/feature/chatbox/schema/chatbox.schema";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Communication Schemas
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export * from "@/shared/communication/permissions/schema/permissions.schema";
export * from "@/shared/communication/moderation/schema/moderation.schema";
export * from "@/shared/communication/mentions/schema/mentions.schema";
export * from "@/shared/communication/notifications/schema/notifications.schema";
export * from "@/shared/communication/status/schema/status.schema";
export * from "@/shared/communication/interactions/schema/interactions.schema";
export * from "@/shared/communication/social/schema/blocks.schema";
