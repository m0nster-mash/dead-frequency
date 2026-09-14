export const AuditModule = {
    CHATBOX: "chatbox",
    FORUM: "forum",
    BLOGS: "blogs",
    GUILD: "guilds",
    USER: "user",
    DM: "dm",
} as const;

export type AuditModule = (typeof AuditModule)[keyof typeof AuditModule];
