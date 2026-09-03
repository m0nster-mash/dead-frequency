"use client";

import styles from "@/feature/forum/styles/forum.module.css";

type AdminThreadControlsProps = {
    threadId?: string;
    threadTitle?: string;
};

export function AdminThreadControls({
                                        threadId,
                                        threadTitle,
                                    }: AdminThreadControlsProps) {
    return (
        <div className={styles.adminThreadControls}>
            <div className={styles.adminResource}>
                <span className={styles.adminResourceLabel}>
                    Thread
                </span>

                <span className={styles.adminResourceName}>
                    {threadTitle || "[THREAD_NAME]"}
                </span>
            </div>

            <div className={styles.adminControlSection}>
                <span className={styles.adminSectionLabel}>
                    Thread status
                </span>

                <div className={styles.adminControlGrid}>
                    <button type="button"
                            className={styles.adminControlButton}>
                        [LOCK_THREAD]
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        [UNLOCK_THREAD]
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
                        [MOVE_THREAD]
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        [PIN_THREAD]
                    </button>

                    <button type="button"
                            className={styles.adminControlButton}>
                        [UNPIN_THREAD]
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
                        [EDIT_THREAD]
                    </button>

                    <button type="button"
                            className={`${styles.adminControlButton} ${styles.adminControlButtonDanger}`}>
                        [DELETE_THREAD]
                    </button>
                </div>
            </div>

            <div className={styles.adminControlFooter}>
                <span className={styles.adminPlaceholderNote}>
                    [ADDITIONAL_THREAD_MODERATION_TOOLS]
                </span>
            </div>
        </div>
    );
}
