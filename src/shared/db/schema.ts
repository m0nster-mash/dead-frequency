// --- 1. Core Host Schemas ---
export * from '../../core/auth/schema/auth.schema';
export * from '../../core/governance/schema/governance.schema';
export * from '../../core/character/schema/character.schema';

// --- 2. Shared Communication Services Schemas ---
export * from '../communication/social/schema/social.schema';
export * from '../communication/moderation/schema/moderation.schema';
export * from '../communication/notification/schema/notifications.schema';
export * from '../communication/interactions/schema/interactions.schema';
export * from '../communication/dm/schema/dm.schema';
export * from '../communication/blog/schema/blog.schema';
export * from '../communication/guild/schema/guild.schema';

// --- 3. Pluggable Feature Package Schemas ---
export * from '../../../packages/feature-avatar/src/schema/avatar.schema';
export * from '../../../packages/feature-chatbox/src/schema/chatbox.schema';
export * from '../../../packages/feature-forum/src/schema/forum.schema';
