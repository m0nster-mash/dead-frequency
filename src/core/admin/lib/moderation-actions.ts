"use server";

import {requireSession} from "@/core/auth/lib/require-session";
import {logAuditAction} from "@/shared/communication/moderation/lib/audit-log";
import {report, userSanction} from "@/shared/communication/moderation/schema/moderation.schema";
import {db} from "@/shared/db/client";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export interface CreateReportPayload {
    targetModule: string;
    targetRecordId: string;
    reason: string;
}

export async function createReportAction(payload: CreateReportPayload) {
    const session = await requireSession();
    const reporterUserId = session.user.id;

    await db.insert(report).values({
        id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetModule: payload.targetModule,
        targetRecordId: payload.targetRecordId,
        reporterUserId,
        reason: payload.reason,
        status: "PENDING",
        createdAt: new Date(),
    });

    return {success: true};
}

export async function resolveReportAction(reportId: string, status: "RESOLVED" | "DISMISSED", resolutionNote?: string) {
    const session = await requireSession({role: "admin"});
    const adminUserId = session.user.id;

    const [existingReport] = await db.select().from(report).where(eq(report.id, reportId));

    if (!existingReport) {
        throw new Error("Report not found.");
    }

    await db
        .update(report)
        .set({
            status,
            resolvedByUserId: adminUserId,
            resolutionNote: resolutionNote || null,
            resolvedAt: new Date(),
        })
        .where(eq(report.id, reportId));

    await logAuditAction({
        actorUserId: adminUserId,
        actionType: "REPORT_RESOLVED",
        targetModule: existingReport.targetModule,
        targetRecordId: existingReport.targetRecordId,
        targetUserId: existingReport.reporterUserId,
        metadata: {
            reportId,
            status,
            resolutionNote,
        },
    });

    revalidatePath("/admin/reports");
    return {success: true};
}

export async function issueSanctionAction(userId: string, sanctionType: string, reason: string, targetModule?: string) {
    const session = await requireSession({role: "admin"});
    const adminUserId = session.user.id;

    await db.insert(userSanction).values({
        id: `sanc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        issuedByUserId: adminUserId,
        sanctionType,
        targetModule: targetModule || null,
        reason,
        createdAt: new Date(),
    });

    await logAuditAction({
        actorUserId: adminUserId,
        actionType: `USER_${sanctionType.toUpperCase()}`,
        targetModule: targetModule || "GLOBAL",
        targetUserId: userId,
        metadata: {reason},
    });

    revalidatePath("/admin/users");
    return {success: true};
}
