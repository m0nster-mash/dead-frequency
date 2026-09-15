/**
 * Moderation report statuses, sanctions, and audit trail actions.
 */
export const REPORT_STATUSES = ['PENDING', 'RESOLVED', 'DISMISSED'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const ReportStatus = {
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    DISMISSED: 'DISMISSED',
} as const;

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'Pending',
    [ReportStatus.RESOLVED]: 'Resolved',
    [ReportStatus.DISMISSED]: 'Dismissed',
};

export const SANCTION_TYPES = [
    'WARNING',
    'MUTE',
    'TIMEOUT',
    'SHADOWBAN',
    'BAN',
    'SOFT_DELETE',
] as const;
export type SanctionType = (typeof SANCTION_TYPES)[number];

export const SanctionType = {
    WARNING: 'WARNING',
    MUTE: 'MUTE',
    TIMEOUT: 'TIMEOUT',
    SHADOWBAN: 'SHADOWBAN',
    BAN: 'BAN',
    SOFT_DELETE: 'SOFT_DELETE',
} as const;

export const SANCTION_TYPE_LABELS: Record<SanctionType, string> = {
    [SanctionType.WARNING]: 'Warning',
    [SanctionType.MUTE]: 'Mute',
    [SanctionType.TIMEOUT]: 'Timeout',
    [SanctionType.SHADOWBAN]: 'Shadowban',
    [SanctionType.BAN]: 'Ban',
    [SanctionType.SOFT_DELETE]: 'Soft Delete',
};

export const AUDIT_ACTIONS = [
    'USER_SANCTION',
    'REPORT_RESOLVE',
    'DM_INSPECT',
    'POST_DELETE',
    'ROLE_CHANGE',
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AuditAction = {
    USER_SANCTION: 'USER_SANCTION',
    REPORT_RESOLVE: 'REPORT_RESOLVE',
    DM_INSPECT: 'DM_INSPECT',
    POST_DELETE: 'POST_DELETE',
    ROLE_CHANGE: 'ROLE_CHANGE',
} as const;

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
    [AuditAction.USER_SANCTION]: 'User Sanction',
    [AuditAction.REPORT_RESOLVE]: 'Report Resolved',
    [AuditAction.DM_INSPECT]: 'DM Inspected',
    [AuditAction.POST_DELETE]: 'Post Deleted',
    [AuditAction.ROLE_CHANGE]: 'Role Changed',
};
