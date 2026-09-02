"use client";

import {DeleteUserModal} from "@/core/admin/components/delete-user-modal";
import {authClient} from "@/core/auth/lib/auth-client";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/shared/styles/form-panel.module.css";
import {useRouter} from "next/navigation";
import {JSX, SubmitEvent, useState} from "react";

/**
 * Properties for the AdminEditUserForm component.
 *
 * @property {string} userId - The unique identifier of the user account being modified
 * @property {string} currentName - The existing display username of the target account
 * @property {string} currentEmail - The existing primary email address of the target account
 * @property {string} currentRole - The current security group authorization role (e.g., "user", "admin")
 * @property {boolean} isCurrentUser - Flag verifying if the logged-in administrator is modifying their own record
 */
type AdminEditUserFormProps = {
    userId: string;
    currentName: string;
    currentEmail: string;
    currentRole: string;
    isCurrentUser: boolean;
};

/**
 * Standardized status tracking template for form operation tracking loops.
 *
 * @property {boolean} loading - Indicates whether an active async transaction is pending
 * @property {string | null} error - Response message captured during a broken execution pipeline
 * @property {string | null} success - User-facing confirmation text for successful database mutations
 */
type SectionState = {
    loading: boolean;
    error: string | null;
    success: string | null;
};

/**
 * Default clean state initialization constant for form transaction cycles.
 */
const idleState: SectionState = {
    loading: false,
    error: null,
    success: null
};

/**
 * An interactive Client Component dashboard form allowing administrators to alter user metrics,
 * change credentials, or terminate platform user accounts.
 *
 * @param {AdminEditUserFormProps} props - The component properties
 *
 * @returns {JSX.Element} The visual multisection account editing dashboard layout interface
 */
export function AdminEditUserForm({
                                      userId,
                                      currentName,
                                      currentEmail,
                                      currentRole,
                                      isCurrentUser,
                                  }: AdminEditUserFormProps): JSX.Element {

    const router = useRouter();
    const [profileState, setProfileState] = useState<SectionState>(idleState);
    const [passwordState, setPasswordState] = useState<SectionState>(idleState);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /**
     * Intercepts and processes the profile modification form lifecycle.
     * Evaluates text modifications and updates profile signatures or authorization roles via the SDK client.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event.
     */
    async function handleProfileSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setProfileState({
            loading: true,
            error: null,
            success: null
        });

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const role = isCurrentUser ? currentRole : String(formData.get("role") || "").trim();

        if (!name || !email) {
            setProfileState({
                loading: false,
                error: "Name and email are required",
                success: null
            });
            return;
        }

        try {
            const updateResult = await authClient.admin.updateUser({
                userId,
                data: {name, email},
            });

            if (updateResult.error) {
                console.error("[admin-edit-form] updateUser error:", updateResult.error);
                setProfileState({
                    loading: false,
                    error: updateResult.error.message || "Failed to update user",
                    success: null,
                });
                return;
            }

            if (!isCurrentUser && role !== currentRole) {
                const roleResult =
                    await authClient.admin.setRole({
                        userId,
                        role: role as "user" | "admin",
                    });

                if (roleResult.error) {
                    console.error("[admin-edit-form] setRole error:", roleResult.error);
                    setProfileState({
                        loading: false,
                        error: roleResult.error.message || "Failed to update role",
                        success: null,
                    });
                    return;
                }
            }
            setProfileState({
                loading: false,
                error: null,
                success: "User updated"
            });
            router.refresh();
        } catch (error) {
            console.error("[admin-edit-form] unexpected error:", error);
            setProfileState({
                loading: false,
                error: error instanceof Error ? error.message : "Unexpected error",
                success: null,
            });
        }
    }

    /**
     * Intercepts and processes the password update lifecycle.
     * Evaluates password syntax and dispatches changes to overwrite target user credentials.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event
     */
    async function handlePasswordSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordState({
            loading: true,
            error: null,
            success: null
        });

        const formData = new FormData(event.currentTarget);
        const newPassword = String(formData.get("newPassword") || "");
        const confirmPassword = String(formData.get("confirmPassword") || "");

        if (newPassword.length < 8) {
            setPasswordState({
                loading: false,
                error: "New password must be at least 8 characters",
                success: null,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordState({loading: false, error: "Passwords do not match", success: null});
            return;
        }

        try {
            const result = await authClient.admin.setUserPassword({userId, newPassword});

            if (result.error) {
                console.error("[admin-edit-form] setUserPassword error:", result.error);
                setPasswordState({
                    loading: false,
                    error: result.error.message || "Failed to update password",
                    success: null,
                });
                return;
            }
            setPasswordState({
                loading: false,
                error: null,
                success: "Password updated"
            });
            event.currentTarget.reset();
        } catch (error) {
            console.error("[admin-edit-form] unexpected error:", error);
            setPasswordState({
                loading: false,
                error: error instanceof Error ? error.message : "Unexpected error",
                success: null,
            });
        }
    }

    return (
        <div className={styles.wrapper}>
            <MainContentPanel title={"Profile Details"}>
                <div className={styles.section}>
                    <form className={styles.form} onSubmit={handleProfileSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="name"> Username </label>
                            <input id={"name"}
                                   name={"name"}
                                   className={styles.input}
                                   defaultValue={currentName}
                                   required/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="email"> Email </label>
                            <input id="email"
                                   name="email"
                                   type="email"
                                   className={styles.input}
                                   defaultValue={currentEmail}
                                   required/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="role"> Role </label>
                            <select id="role"
                                    name="role"
                                    className={styles.input}
                                    defaultValue={currentRole}
                                    disabled={isCurrentUser}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {isCurrentUser && (
                                <p className={styles.sectionSubtitle}>You can&apos;t change your own role.</p>
                            )}
                        </div>
                        {profileState.error ? <p className={styles.error}>{profileState.error}</p> : null}
                        {profileState.success ? (<p className={styles.success}>{profileState.success}</p>) : null}
                        <div className={styles.actions}>
                            <button type="submit" className={styles.submit} disabled={profileState.loading}>
                                {profileState.loading ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </MainContentPanel>

            <MainContentPanel title={"Password"}>
                <div className={styles.section}>
                    <form className={styles.form} onSubmit={handlePasswordSubmit}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="newPassword"> New password </label>
                                <input id="newPassword"
                                       name="newPassword"
                                       type="password"
                                       className={styles.input}
                                       autoComplete="new-password"
                                       required/>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="confirmPassword"> Confirm new password </label>
                                <input id="confirmPassword"
                                       name="confirmPassword"
                                       type="password"
                                       className={styles.input}
                                       autoComplete="new-password"
                                       required/>
                            </div>
                        </div>
                        {passwordState.error ? <p className={styles.error}>{passwordState.error}</p> : null}
                        {passwordState.success ? (<p className={styles.success}>{passwordState.success}</p>) : null}
                        <div className={styles.actions}>
                            <button type="submit" className={styles.submit} disabled={passwordState.loading}>
                                {passwordState.loading ? "Saving..." : "Update password"}
                            </button>
                        </div>
                    </form>
                </div>
            </MainContentPanel>

            <MainContentPanel title={"Delete User"}>
                <div className={styles.section}>
                    <p className={styles.sectionSubtitle}>
                        Deleting this user removes their account and sessions permanently.
                    </p>
                    <div className={styles.actions}>
                        <button type="button"
                                className={styles.submit}
                                disabled={isCurrentUser}
                                onClick={() => setShowDeleteModal(true)}>
                            Delete user
                        </button>
                    </div>
                </div>
            </MainContentPanel>

            {showDeleteModal && (
                <DeleteUserModal userId={userId}
                                 userEmail={currentEmail}
                                 onCloseAction={() => setShowDeleteModal(false)}
                                 onDeletedAction={() => router.push("/admin")}/>
            )}
        </div>
    );
}
