"use server";

import { auth } from "@/_core/auth";
import { headers } from "next/headers";
import { db } from "@/_shared/db/client";
import { notification } from "@/_shared/communication/notifications/schema/notifications.schema";
import { and, eq, desc, count } from "drizzle-orm";

export async function getUserNotifications(limit: number = 20) {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;
    if (!session?.user) return [];

    return db
        .select()
        .from(notification)
        .where(eq(notification.userId, session.user.id))
        .orderBy(desc(notification.createdAt))
        .limit(limit);
}

export async function getUnreadNotificationCount(): Promise<number> {
    const reqHeaders = await headers();
    const session = auth ? await auth.api.getSession({ headers: reqHeaders }) : null;
    if (!session?.user) return 0;

    const [result] = await db
        .select({ unread: count() })
        .from(notification)
        .where(
            and(
                eq(notification.userId, session.user.id),
                eq(notification.read, false)
            )
        );

    return result?.unread ?? 0;
}
