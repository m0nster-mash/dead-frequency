export const AuditModule = {
    CHATBOX: "chatbox",
    FORUM: "forum",
    BLOGS: "blogs",
    GUILD: "guilds",
    USER: "user",
    DM: "dm",
} as const;

export type AuditModule = (typeof AuditModule)[keyof typeof AuditModule];

export const AuditAction = {
    DELETE: "delete",
    RESTORE: "restore",
    EDIT: "edit",
    BAN: "ban",
    MUTE: "mute",
    SHADOWBAN: "shadowban",
    REPORT_RESOLVED: "report_resolved",
    INSPECT_DM: "inspect_dm",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const SanctionType = {
    MUTE: "MUTE",
    SHADOWBAN: "SHADOWBAN",
    TIMEOUT: "TIMEOUT",
    RESTRICT: "RESTRICT",
} as const;

export type SanctionType = (typeof SanctionType)[keyof typeof SanctionType];
