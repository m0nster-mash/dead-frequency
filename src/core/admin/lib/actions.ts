"use server";

import {headers} from "next/headers";
import {auth} from "@/core/auth";
import {setPostingStatus} from "@shared/communication/status/lib/status";
import {moduleEnum} from "@shared/communication/moderation/schema/moderation.schema";

export async function applyPostingStatusAction(formData: FormData) {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user || session.user.role !== "admin") throw new Error("Forbidden");

    const userId = String(formData.get("userId"));
    const moduleValue = String(formData.get("module") || "");
    const status = String(formData.get("status")) as "active" | "muted" | "shadowbanned" | "banned";
    const reason = String(formData.get("reason") || "") || undefined;

    await setPostingStatus({
        userId,
        module: moduleValue ? (moduleValue as (typeof moduleEnum.enumValues)[number] | null) : null,
        status,
        moderatorId: session.user.id,
        reason,
    });
}
