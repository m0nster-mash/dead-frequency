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
