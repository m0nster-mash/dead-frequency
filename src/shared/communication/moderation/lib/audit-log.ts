import { db } from "@/shared/db/client";
import { auditLog } from "@/shared/communication/moderation/schema/moderation.schema";
import { headers } from "next/headers";

export interface LogAuditParams {
    actorUserId?: string;
    moderatorId?: string; // Supported as fallback alias
    targetUserId?: string | null;
    module?: string | null;
    targetModule?: string | null;
    action?: string;
    actionType?: string;
    recordId?: string | null;
    targetRecordId?: string | null;
    reason?: string | null;
    metadata?: Record<string, unknown>;
}

/**
 * Persists an immutable administrative audit record detailing staff actions across all system modules.
 */
export async function logAuditAction(params: LogAuditParams): Promise<void> {
    const reqHeaders = await headers();
    const rawForwarded = reqHeaders.get("x-forwarded-for");

    let ipAddress: string | null = null;
    if (rawForwarded) {
        const [firstIp] = rawForwarded.split(",");
        ipAddress = firstIp?.trim() || null;
    } else {
        ipAddress = reqHeaders.get("x-real-ip") || null;
    }

    const actorUserId = params.actorUserId || params.moderatorId;
    if (!actorUserId) {
        throw new Error("logAuditAction requires an actorUserId or moderatorId.");
    }

    const targetModule = params.targetModule || params.module || null;
    const actionType = params.actionType || params.action || "UNKNOWN";
    const targetRecordId = params.targetRecordId || params.recordId || null;

    await db.insert(auditLog).values({
        id: crypto.randomUUID(),
        actorUserId,
        targetUserId: params.targetUserId ?? null,
        targetModule,
        actionType,
        targetRecordId,
        metadata: {
            ...(params.metadata || {}),
            ...(params.reason ? { reason: params.reason } : {}),
        },
        ipAddress,
        createdAt: new Date(),
    });
}
