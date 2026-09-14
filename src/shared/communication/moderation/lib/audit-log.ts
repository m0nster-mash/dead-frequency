import { db } from "@/shared/db/client";
import { auditLog } from "../schema/moderation.schema";

export interface LogAuditEventParams {
    actorUserId: string;
    actionType: string;
    targetModule?: string;
    targetRecordId?: string;
    targetUserId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
}

/**
 * Writes an immutable audit entry to the centralized audit log table.
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
    await db.insert(auditLog).values({
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        actorUserId: params.actorUserId,
        actionType: params.actionType,
        targetModule: params.targetModule || null,
        targetRecordId: params.targetRecordId || null,
        targetUserId: params.targetUserId || null,
        metadata: params.metadata || null,
        ipAddress: params.ipAddress || null,
        createdAt: new Date(),
    });
}
