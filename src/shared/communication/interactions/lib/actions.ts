"use server";

import { auth } from "@/core/auth";
import { headers } from "next/headers";
import { db } from "@/shared/db/client";
import { randomUUID } from "crypto";
import { report, reportReasonEnum, reaction } from "@/shared/communication/interactions/schema/interactions.schema";
import { userRole } from "@/shared/communication/permissions/schema/permissions.schema";
import { recordNegativeSignal } from "@/shared/communication/status/lib/trust";
import { notify } from "@/shared/communication/notifications/lib/notify";
import { moduleEnum } from "@/shared/communication/moderation/schema/moderation.schema";
import { isModerator } from "@/shared/communication/permissions/lib/permissions";
import { resolveAuthor } from "@/shared/communication/author/lib/author";
import { canInteract } from "@/shared/communication/social/lib/can-interact";
import { inArray, eq, and } from "drizzle-orm";
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

export async function toggleReactionAction(input: {
    module: TargetModule;
    recordId: string;
    targetUserId?: string;
    emoji?: string;
}): Promise<{ reacted: boolean; count: number }> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;

    if (!session?.user) {
        throw new Error("Unauthorized: Log in required to react.");
    }

    const emoji = input.emoji ?? "👍";
    const author = resolveAuthor(session.user.id);

    if (input.targetUserId && !(await canInteract(session.user.id, input.targetUserId))) {
        throw new Error("Interaction not permitted.");
    }

    const [existing] = await db
        .select()
        .from(reaction)
        .where(
            and(
                eq(reaction.module, input.module),
                eq(reaction.recordId, input.recordId),
                eq(reaction.userId, session.user.id),
                eq(reaction.emoji, emoji)
            )
        )
        .limit(1);

    let reacted = false;

    if (existing) {
        await db.delete(reaction).where(eq(reaction.id, existing.id));
    } else {
        await db.insert(reaction).values({
            id: randomUUID(),
            module: input.module,
            recordId: input.recordId,
            userId: author.userId,
            characterId: author.characterId,
            emoji,
        });
        reacted = true;

        if (input.targetUserId && input.targetUserId !== session.user.id) {
            await notify({
                userId: input.targetUserId,
                type: "comment",
                payload: {
                    action: "reaction",
                    module: input.module,
                    recordId: input.recordId,
                    emoji,
                    fromUserId: session.user.id,
                },
            });
        }
    }

    const totalReactions = await db
        .select()
        .from(reaction)
        .where(and(eq(reaction.module, input.module), eq(reaction.recordId, input.recordId)));

    revalidatePath("/", "layout");
    return { reacted, count: totalReactions.length };
}
