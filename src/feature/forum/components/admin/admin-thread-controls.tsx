"use client";

// import styles from "@/feature/forum/styles/forum.module.css";
import styles from "@/shared/styles/form.module.css";
import Placeholder from "@shared/components/placeholder";

/**
 * TODO:: clean up styles
 */
type AdminThreadControlsProps = {
    threadId?: string;
    threadTitle?: string;
};

export function AdminThreadControls({threadId, threadTitle,}: AdminThreadControlsProps) {
    return (
        <div className={styles.adminThreadControls}>
            <div className={styles.adminResource}>
                <span className={styles.adminResourceLabel}>
                    Thread
                </span>

                <span className={styles.adminResourceName}>
                    {threadTitle || <Placeholder text={"THREAD_NAME"}/>}
                </span>
            </div>

            <div className={styles.adminControlSection}>
                <span className={styles.adminSectionLabel}>
                    Thread status
                </span>

                <div className={styles.adminControlGrid}>
                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"LOCK_THREAD"}/>
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"UNLOCK_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={styles.adminControlSection}>
                <span className={styles.adminSectionLabel}>
                    Thread management
                </span>

                <div className={styles.adminControlGrid}>
                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"MOVE_THREAD"}/>
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"PIN_THREAD"}/>
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"UNPIN_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={styles.adminControlSection}>
                <span className={styles.adminSectionLabel}>
                    Moderation
                </span>

                <div className={styles.adminControlGrid}>
                    <button type="button"
                            className={styles.adminControlButton}>
                        <Placeholder text={"EDIT_THREAD"}/>
                    </button>

                    <button type="button"
                            className={`${styles.adminControlButton} ${styles.adminControlButtonDanger}`}>
                        <Placeholder text={"DELETE_THREAD"}/>
                    </button>
                </div>
            </div>

            <div className={styles.adminControlFooter}>
                <span className={styles.adminPlaceholderNote}>
                   <Placeholder text={"ADDITIONAL_THREAD_MODERATION_TOOLS"}/>
                </span>
            </div>
        </div>
    );
}
