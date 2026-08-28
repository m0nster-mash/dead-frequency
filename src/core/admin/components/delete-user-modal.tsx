"use client";

import {SubmitEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";

type DeleteUserModalProps = {
    onCloseAction: () => void;
    onDeletedAction?: () => void;
    userEmail: string;
    userId: string;
};

export function DeleteUserModal({
                                    userId, userEmail, onCloseAction, onDeletedAction,
                                }: DeleteUserModalProps) {
    const router = useRouter();
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isConfirmed = confirmation.trim().toLowerCase() === userEmail.toLowerCase();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        setError(null);

        const result = await authClient.admin.removeUser({userId});

        if (result.error) {
            setError(result.error.message || "Failed to delete user");
            setLoading(false);
            return;
        }

        setLoading(false);
        onDeletedAction?.();
        onCloseAction();
        router.refresh();
    }

    return (
        <div role="presentation" onClick={onCloseAction}>
            <div role="dialog"
                 aria-modal="true"
                 aria-labelledby="delete-user-title"
                 onClick={(event) => event.stopPropagation()}>
                <h2 id="delete-user-title"> Delete user </h2>
                <p> Are you sure you want to delete <strong>{userEmail}</strong>? This
                    cannot be undone. </p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label className="form-label" htmlFor="confirm-email">
                            Type <strong>{userEmail}</strong> to confirm
                        </label>
                        <input className="form-input"
                               id="confirm-email"
                               name="confirmEmail"
                               autoComplete="off"
                               value={confirmation}
                               onChange={(event) => setConfirmation(event.target.value)}
                               required/>
                    </div>

                    {error ? <p className="form-error">{error}</p> : null}

                    <div>
                        <button type="button"
                                onClick={onCloseAction}
                                disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit"
                                disabled={!isConfirmed || loading}>
                            {loading ? "Deleting..." : "Delete user"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}