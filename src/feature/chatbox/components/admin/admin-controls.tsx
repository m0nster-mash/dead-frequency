"use client";

import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import modalStyles from "@/shared/styles/modal.module.css";
import {JSX, ReactNode} from "react";

type AdminControlsProps = {
    type: "message" | "conversation";
    open: boolean;
    onCloseAction: () => void;
    children: ReactNode;
};

/**
 * Modal wrapper for admin control panels.
 * Handles open/close state and backdrop click handling.
 */
export function AdminControls({
                                  type,
                                  open,
                                  onCloseAction,
                                  children,
                              }: AdminControlsProps): JSX.Element {
    if (!open) return <></>;

    return (
        <div
            className={chatboxStyles.adminControlsBackdrop}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onCloseAction();
                }
            }}
        >
            <div className={chatboxStyles.adminControlsModal}>
                <div className={modalStyles.modalHeader}>
                    <span className={modalStyles.modalTitle}>
                        Manage {type}
                    </span>

                    <button
                        type="button"
                        className={`${buttonStyles.iconBtn}`}
                        onClick={onCloseAction}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className={chatboxStyles.adminControlsContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}
