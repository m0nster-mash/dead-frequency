"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserNotifications } from "@/shared/communication/notifications/lib/queries";
import {
    markNotificationAsReadAction,
    markAllNotificationsAsReadAction,
} from "@/shared/communication/notifications/lib/actions";

import panelStyles from "@/shared/styles/panel.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";

type NotificationItem = {
    id: string;
    type: string;
    payload: Record<string, unknown> | null;
    read: boolean;
    createdAt: Date | string;
};

/**
 * Resolves the destination URL for a given notification.
 * If no explicit route is specified in the payload, defaults to /notifications.
 */
export function resolveNotificationUrl(item: NotificationItem): string {
    if (item.payload && typeof item.payload.url === "string" && item.payload.url.trim()) {
        return item.payload.url;
    }

    const moduleName = item.payload?.module;

    if (item.type === "mod_action") {
        return "/admin/reports";
    }

    if (moduleName === "forum" && typeof item.payload?.threadId === "string") {
        return `/forum/thread/${item.payload.threadId}`;
    }

    // Fallback for chatbox messages, reactions, or generic notifications without dedicated pages
    return "/notifications";
}

export function NotificationPanel({ limit = 20 }: { limit?: number }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadNotifications = useCallback(async () => {
        try {
            const data = await getUserNotifications(limit);
            setNotifications(data as NotificationItem[]);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    async function handleNotificationClick(item: NotificationItem) {
        if (!item.read) {
            await markNotificationAsReadAction(item.id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
            );
        }

        const destinationUrl = resolveNotificationUrl(item);
        router.push(destinationUrl);
    }

    async function handleMarkAllAsRead(e: React.MouseEvent) {
        e.stopPropagation();
        await markAllNotificationsAsReadAction();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    function getNotificationText(item: NotificationItem) {
        switch (item.type) {
            case "mention":
                return "You were mentioned in a post.";
            case "comment":
                return item.payload?.action === "reaction"
                    ? `Someone reacted ${item.payload.emoji ?? "👍"} to your message.`
                    : "Someone commented on your post.";
            case "mod_action":
                return "A moderation action requires administrative review.";
            case "reply":
                return "Someone replied to your thread.";
            default:
                return "You received a new notification.";
        }
    }

    return (
        <div className={panelStyles.panel}>
            <div className={panelStyles.panelHeader}>
                <div>
                    <h3 className={panelStyles.panelHeaderTitle}>Notifications</h3>
                </div>
                {notifications.some((n) => !n.read) && (
                    <button
                        type="button"
                        className={`${buttonStyles.btn} ${buttonStyles.btnSecondary}`}
                        style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className={panelStyles.panelBody} style={{ padding: 0 }}>
                {loading ? (
                    <div className={panelStyles.panelEmptyState}>
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className={panelStyles.panelEmptyState}>
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {notifications.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid var(--color-border)",
                                    backgroundColor: item.read
                                        ? "transparent"
                                        : "var(--color-surface-hover)",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <p style={{ margin: 0, fontSize: "0.875rem" }}>
                                        {getNotificationText(item)}
                                    </p>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--color-text-muted)",
                                        }}
                                    >
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                                </div>
                                {!item.read && (
                                    <span
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--color-danger, #ff5050)",
                                        }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
