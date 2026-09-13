"use client";

import {getUnreadNotificationCount} from "@/_shared/communication/notifications/lib/queries";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import sidebarStyles from "@/_shared/styles/patterns/sidebar.module.css";
import BellIcon from "@/_shared/svg/bootstrap-bell-icon.svg";
import {JSX, useEffect, useState} from "react";
import {NotificationPanel} from "./notification-panel";

export function NotificationDropdown(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        async function fetchUnread() {
            try {
                const count = await getUnreadNotificationCount();
                setUnreadCount(count);
            } catch (err) {
                // Silently handle unauthenticated or network errors
            }
        }

        fetchUnread();
        const interval = setInterval(fetchUnread, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{position: "relative", display: "inline-block"}}>
            <button
                type="button"
                className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled} ${sidebarStyles.notificationButton}`}
                aria-label="Notifications"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <BellIcon/>
                {unreadCount > 0 && <span className={sidebarStyles.notificationDot}/>}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 0.5rem)",
                        right: 0,
                        width: "360px",
                        maxWidth: "90vw",
                        zIndex: 100,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                        borderRadius: "var(--radius-sm, 8px)",
                    }}
                >
                    <NotificationPanel limit={10}/>
                </div>
            )}
        </div>
    );
}
