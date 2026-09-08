"use client";

import adminStyles from "@/feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
import modalStyles from "@/shared/styles/modal.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import Placeholder from "@shared/components/placeholder";
import {JSX} from "react";

type MessageAdminControlsProps = {
    messageId: string;
    conversationId: string;
    authorName?: string | null;
};

/**
 * Modal content for managing a specific chatbox message.
 * Provides admin actions like delete with reason logging.
 */
export function MessageAdminControls({
                                         messageId,
                                         conversationId,
                                         authorName,
                                     }: MessageAdminControlsProps): JSX.Element {
    return (
        <div className={adminStyles.messageAdminControls}>
            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>Message</span>

                <span className={modalStyles.modalDescription}>
                    {authorName || "Unknown user"}
                </span>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>Moderation</span>

                <div className={formStyles.formGrid}>
                    <div className={formStyles.formField}>
                        <label
                            htmlFor={`delete-reason-${messageId}`}
                            className={formStyles.formLabel}
                        >
                            Reason for Deletion (Optional)
                        </label>

                        <input
                            id={`delete-reason-${messageId}`}
                            type="text"
                            className={formStyles.formInput}
                            placeholder="e.g., Spam, Inappropriate content"
                            maxLength={255}
                        />
                    </div>
                </div>

                <div className={formStyles.formGrid}>
                    <button
                        type="button"
                        className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${adminStyles.adminControlButtonDanger}`}
                    >
                        <Placeholder text={"DELETE_MESSAGE"} />
                    </button>
                </div>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalDescription}>
                    <Placeholder text={"ADDITIONAL_MESSAGE_MODERATION_TOOLS"} />
                </span>
            </div>
        </div>
    );
}
