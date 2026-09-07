"use client";

import {AdminControls} from "@/feature/chatbox/components/admin/admin-controls";
import {MessageAdminControls} from "@/feature/chatbox/components/admin/message-admin-controls";
import buttonStyles from "@/shared/styles/buttons.module.css";
import GearIcon from "@shared/svg/bootstrap-gear-icon.svg";
import {JSX, useState} from "react";

type MessageAdminButtonProps = {
    messageId: string;
    authorName?: string | null;
    conversationId: string;
};

/**
 * Admin action button for managing a chatbox message.
 * Opens a modal with moderation options (delete, etc).
 */
export function MessageAdminButton({
                                       messageId,
                                       authorName,
                                       conversationId,
                                   }: MessageAdminButtonProps): JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                onClick={() => setOpen(true)}
                aria-label={`Manage message from ${authorName}`}
            >
                <GearIcon />
            </button>

            <AdminControls
                type="message"
                open={open}
                onCloseAction={() => setOpen(false)}
            >
                <MessageAdminControls
                    messageId={messageId}
                    conversationId={conversationId}
                    authorName={authorName}
                />
            </AdminControls>
        </>
    );
}
