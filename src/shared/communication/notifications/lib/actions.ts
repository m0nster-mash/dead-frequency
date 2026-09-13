"use server";

import { auth } from "@/core/auth";
import { headers } from "next/headers";
import { db } from "@/shared/db/client";
import { notification } from "@/shared/communication/notifications/schema/notifications.schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction(notificationId: string): Promise<void> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;
    if (!session?.user) return;

    await db
        .update(notification)
        .set({ read: true })
        .where(
            and(
                eq(notification.id, notificationId),
                eq(notification.userId, session.user.id)
            )
        );

    revalidatePath("/", "layout");
}

export async function markAllNotificationsAsReadAction(): Promise<void> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;
    if (!session?.user) return;

    await db
        .update(notification)
        .set({ read: true })
        .where(
            and(
                eq(notification.userId, session.user.id),
                eq(notification.read, false)
            )
        );

    revalidatePath("/", "layout");
}
