import {randomUUID} from "crypto";
import {auditLog} from "../schema/moderation.schema";
import {db} from "@shared/db/client";

type LogModActionInput = {
    module: (typeof auditLog.module.enumValues)[number];
    recordId: string;
    action: (typeof auditLog.action.enumValues)[number];
    moderatorId: string;
    targetUserId?: string | null;
    reason?: string | null;
};

/**
 * The single entry point every module's admin action must call.
 * Never write directly to auditLog from feature code — always route
 * through here so the shape can't drift between modules.
 */
export async function logModAction(input: LogModActionInput) {
    await db.insert(auditLog).values({
        id: randomUUID(),
        module: input.module,
        recordId: input.recordId,
        action: input.action,
        moderatorId: input.moderatorId,
        targetUserId: input.targetUserId ?? null,
        reason: input.reason ?? null,
    });
}
