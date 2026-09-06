"use client";

import {authClient} from "@/core/auth/lib/auth-client";
// import styles from "@/shared/styles/form-panel.module.css";
import styles from "@/shared/styles/form.module.css";
import {useRouter} from "next/navigation";
import {JSX, SubmitEvent, useState} from "react";

/**
 * Properties for the DeleteUserModal component.
 *
 * @property {() => void} onCloseAction - Callback invoked to dismiss or close the modal view overlay.
 * @property {() => void} [onDeletedAction] - Optional secondary handler executed following successful record deletion.
 * @property {string} userEmail - The email address of the account targeted for deletion, used to enforce string
 *                                verification.
 * @property {string} userId - The unique identifier of the user record targeted for removal.
 */
type DeleteUserModalProps = {
    onCloseAction: () => void;
    onDeletedAction?: () => void;
    userEmail: string;
    userId: string;
};

/**
 * An interactive Client Component overlay portal that enforces a high-security manual confirmation flow before
 * executing permanent account deletion.
 *
 * @param {DeleteUserModalProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual overlay confirmation modal viewport dialog layer.
 */
export function DeleteUserModal({
                                    userId, userEmail, onCloseAction, onDeletedAction,
                                }: DeleteUserModalProps): JSX.Element {
    const router = useRouter();
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // ensures submission button remains locked until string patterns line up perfectly
    const isConfirmed = confirmation.trim().toLowerCase() === userEmail.toLowerCase();

    /**
     * Intercepts and processes the final deletion submit request sequence. Evaluates verification values and passes
     * execution instructions down to the administrative SDK handler.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event context.
     */
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        // block background execution hacks if the check flag is falsy
        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // dispatches deletion transaction request through the secure auth client
            const result = await authClient.admin.removeUser({userId});

            if (result.error) {
                setError(result.error.message || "Failed to delete user");
                setLoading(false);
                return;
            }

            setLoading(false);
            onDeletedAction?.(); // run post-deletion pipelines if attached by parent grids
            onCloseAction();     // dismounts the modal interface layout view node safely
            router.refresh();    // invalidates active layouts, forcing server updates to fetch fresh inventory streams
        } catch (err) {
            console.error("[delete-user-modal] execution error:", err);
            setError("An unexpected system exception occurred during the deletion request.");
            setLoading(false);
        }
    }

    return (
        <div className={styles.modalOverlay}
             role="presentation"
             onClick={onCloseAction}>
            <div className={styles.modal}
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="delete-user-title"
                 onClick={(event) => event.stopPropagation()}>

                <h2 id="delete-user-title"
                    className={styles.modalTitle}>
                    Delete user
                </h2>
                <p className={styles.modalDescription}>
                    Are you sure you want to delete{" "}
                    <strong>{userEmail}</strong>?
                    This cannot be undone.
                </p>

                <form className={styles.modalForm}
                      onSubmit={handleSubmit}>
                    <div className={styles.modalField}>
                        <label className={styles.modalLabel} htmlFor="confirm-email">
                            Type <strong>{userEmail}</strong> to confirm
                        </label>
                        <input className={styles.modalInput}
                               id="confirm-email"
                               name="confirmEmail"
                               autoComplete="off"
                               value={confirmation}
                               onChange={(event) => setConfirmation(event.target.value)}
                               required/>
                    </div>

                    {error ? (<p className={styles.modalError}> {error} </p>) : null}

                    <div className={styles.modalActions}>
                        <button type="button"
                                className={styles.modalCancel}
                                onClick={onCloseAction}
                                disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit"
                                className={styles.modalSubmit}
                                disabled={!isConfirmed || loading}>
                            {loading ? "Deleting..." : "Delete user"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
