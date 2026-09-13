"use client";

import adminStyles from "@/feature/forum/styles/admin.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
import modalStyles from "@/shared/styles/modal.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import Placeholder from "@/shared/components/placeholder";

type AdminThreadControlsProps = {
    threadId?: string;
    threadTitle?: string;
};

export function AdminThreadControls({threadId, threadTitle,}: AdminThreadControlsProps) {
    return (
        <div>
            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>
                    Thread:
                </span>

                <span className={modalStyles.modalDescription}>
                    {threadTitle}
                </span>
            </div>
            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>
                    ID:
                </span>

                <span className={modalStyles.modalDescription}>
                    {threadId}
                </span>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>
                    Thread status
                </span>

                <div className={formStyles.formGrid}>
                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"LOCK_THREAD"}/>
                    </button>

                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"UNLOCK_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>
                    Thread management
                </span>

                <div className={formStyles.formGrid}>
                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"MOVE_THREAD"}/>
                    </button>

                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"PIN_THREAD"}/>
                    </button>

                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"UNPIN_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalHeader}>
                    Moderation
                </span>

                <div className={formStyles.formGrid}>
                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        <Placeholder text={"EDIT_THREAD"}/>
                    </button>

                    <button type="button"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${adminStyles.adminControlButtonDanger}`}>
                        <Placeholder text={"DELETE_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={panelStyles.panelPadded}>
                <span className={modalStyles.modalDescription}>
                   <Placeholder text={"ADDITIONAL_THREAD_MODERATION_TOOLS"}/>
                </span>
            </div>
        </div>
    );
}
