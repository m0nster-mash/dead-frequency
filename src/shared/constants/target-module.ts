/**
 * Target modules for polymorphic attachments (comments, reactions, reports, audit logs).
 */
export const TARGET_MODULES = [
    'BLOG',
    'BLOG_POST',
    'USER_PROFILE',
    'CHARACTER',
    'CHARACTER_PROFILE',
    'GUILD',
    'FORUM_POST',
    'COMMENT',
    'CHATBOX_MESSAGE',
    'CHATROOM_MESSAGE',
    'DIRECT_MESSAGE',
] as const;

export type TargetModule = (typeof TARGET_MODULES)[number];

export const TargetModule = {
    BLOG: 'BLOG',
    BLOG_POST: 'BLOG_POST',
    USER_PROFILE: 'USER_PROFILE',
    CHARACTER: 'CHARACTER',
    CHARACTER_PROFILE: 'CHARACTER_PROFILE',
    GUILD: 'GUILD',
    FORUM_POST: 'FORUM_POST',
    COMMENT: 'COMMENT',
    CHATBOX_MESSAGE: 'CHATBOX_MESSAGE',
    CHATROOM_MESSAGE: 'CHATROOM_MESSAGE',
    DIRECT_MESSAGE: 'DIRECT_MESSAGE',
} as const;

export const TARGET_MODULE_LABELS: Record<TargetModule, string> = {
    [TargetModule.BLOG]: 'Blog',
    [TargetModule.BLOG_POST]: 'Blog Post',
    [TargetModule.USER_PROFILE]: 'User Profile',
    [TargetModule.CHARACTER]: 'Character',
    [TargetModule.CHARACTER_PROFILE]: 'Character Profile',
    [TargetModule.GUILD]: 'Guild',
    [TargetModule.FORUM_POST]: 'Forum Post',
    [TargetModule.COMMENT]: 'Comment',
    [TargetModule.CHATBOX_MESSAGE]: 'Chatbox Message',
    [TargetModule.CHATROOM_MESSAGE]: 'Chatroom Message',
    [TargetModule.DIRECT_MESSAGE]: 'Direct Message',
};
