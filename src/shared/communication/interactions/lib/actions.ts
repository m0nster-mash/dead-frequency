"use server";

import { auth } from "@/core/auth";
import { headers } from "next/headers";
import { db } from "@/shared/db/client";
import { randomUUID } from "crypto";
import { report, reportReasonEnum } from "@/shared/communication/interactions/schema/interactions.schema";
import { userRole } from "@/shared/communication/permissions/schema/permissions.schema";
import { recordNegativeSignal } from "@/shared/communication/status/lib/trust";
import { notify } from "@/shared/communication/notifications/lib/notify";
import { moduleEnum } from "@/shared/communication/moderation/schema/moderation.schema";
import { isModerator } from "@/shared/communication/permissions/lib/permissions";
import { inArray, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ReportReason = (typeof reportReasonEnum.enumValues)[number];
type TargetModule = (typeof moduleEnum.enumValues)[number];

export async function submitReportAction(input: {
    module: TargetModule;
    recordId: string;
    targetUserId?: string;
    reason: ReportReason;
    details?: string;
}): Promise<{ reportId: string }> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;

    if (!session?.user) {
        throw new Error("Unauthorized: You must be logged in to report content.");
    }

    const reportId = randomUUID();

    await db.insert(report).values({
        id: reportId,
        module: input.module,
        recordId: input.recordId,
        reporterId: session.user.id,
        reason: input.reason,
        details: input.details ?? null,
        resolved: "open",
    });

    if (input.targetUserId) {
        await recordNegativeSignal(input.targetUserId);
    }

    const moderators = await db
        .select({ userId: userRole.userId })
        .from(userRole)
        .where(inArray(userRole.roleId, ["admin", "moderator"]));

    for (const mod of moderators) {
        await notify({
            userId: mod.userId,
            type: "mod_action",
            payload: {
                module: input.module,
                recordId: input.recordId,
                reportId,
                reason: input.reason,
            },
        });
    }

    revalidatePath("/admin/reports");
    return { reportId };
}

export async function resolveReportAction(input: {
    reportId: string;
    status: "actioned" | "dismissed";
}): Promise<void> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;

    if (!session?.user || !(await isModerator(session.user.id))) {
        throw new Error("Unauthorized: Moderation clearance required.");
    }

    await db
        .update(report)
        .set({ resolved: input.status })
        .where(eq(report.id, input.reportId));

    revalidatePath("/admin/reports");
}

