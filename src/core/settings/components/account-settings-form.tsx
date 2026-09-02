"use client";

import {authClient} from "@/core/auth/lib/auth-client";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/shared/styles/form-panel.module.css";
import {useRouter} from "next/navigation";
import {JSX, SubmitEvent, useState} from "react";

/**
 * Properties for the AccountSettingsForm component.
 *
 * @property {string} currentName - The user's existing display username.
 * @property {string} currentEmail - The user's existing primary email address.
 */
type AccountSettingsFormProps = {
    currentName: string;
    currentEmail: string;
};

/**
 * Standardized status tracking template for form operation tracking loops.
 *
 * @property {boolean} loading - Indicates whether an active async transaction is pending.
 * @property {string | null} error - Response message captured during a broken execution pipeline.
 * @property {string | null} success - User-facing confirmation text for successful mutations.
 */
type SectionState = {
    loading: boolean;
    error: string | null;
    success: string | null;
};

/**
 * Default clean state initialization constant for form transaction cycles.
 */
const idleState: SectionState = {loading: false, error: null, success: null};

/**
 * An interactive Client Component dashboard form allowing self-service account configurations. Users can
 * independently update their display identity name, primary email address, or security credentials.
 *
 * @param {AccountSettingsFormProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual multisection account configurations dashboard layout interface.
 */
export function AccountSettingsForm({
                                        currentName,
                                        currentEmail,
                                    }: AccountSettingsFormProps): JSX.Element {
    const router = useRouter();
    const [profileState, setProfileState] = useState<SectionState>(idleState);
    const [emailState, setEmailState] = useState<SectionState>(idleState);
    const [passwordState, setPasswordState] = useState<SectionState>(idleState);

    /**
     * Intercepts and processes the username modification lifecycle.
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

        if (!name) {
            setProfileState({
                loading: false,
                error: "Username is required",
                success: null
            });
            return;
        }

        const result = await authClient.updateUser({name});

        if (result.error) {
            setProfileState({
                loading: false,
                error: result.error.message || "Failed to update username",
                success: null,
            });
            return;
        }

        setProfileState({
            loading: false,
            error: null,
            success: "Username updated"
        });
        router.refresh();
    }

    /**
     * Intercepts and processes the primary email modification lifecycle.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event.
     */
    async function handleEmailSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setEmailState({
            loading: true,
            error: null,
            success: null
        });

        const formData = new FormData(event.currentTarget);
        const newEmail = String(formData.get("email") || "").trim();

        if (!newEmail) {
            setEmailState({
                loading: false,
                error: "Email is required",
                success: null
            });
            return;
        }

        if (newEmail === currentEmail) {
            setEmailState({
                loading: false,
                error: "That is already your email",
                success: null
            });
            return;
        }

        const result = await authClient.changeEmail({
            newEmail,
            callbackURL: "/dashboard/settings",
        });

        if (result.error) {
            setEmailState({
                loading: false,
                error: result.error.message || "Failed to update email",
                success: null,
            });
            return;
        }

        setEmailState({
            loading: false,
            error: null,
            success: "Email updated. Check your inbox if verification is required.",
        });
        router.refresh();
    }

    /**
     * Intercepts and processes the secure credential alteration lifecycle.
     * Enforces input confirmation alignments and kicks other active browser vaults off the platform.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event.
     */
    async function handlePasswordSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordState({
            loading: true,
            error: null,
            success: null
        });

        const formData = new FormData(event.currentTarget);
        const currentPassword = String(formData.get("currentPassword") || "");
        const newPassword = String(formData.get("newPassword") || "");
        const confirmPassword = String(formData.get("confirmPassword") || "");

        // Validation Guard: Ensure the matching checks pass correctly
        if (newPassword !== confirmPassword) {
            setPasswordState({
                loading: false,
                error: "New passwords do not match",
                success: null
            });
            return;
        }

        // Complexity Safeguard Guard: Enforce strict minimum length thresholds
        if (newPassword.length < 8) {
            setPasswordState({
                loading: false,
                error: "New password must be at least 8 characters",
                success: null,
            });
            return;
        }

        const result = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true, // Forcibly de-authenticates secondary locations to maintain high session hygiene
        });

        if (result.error) {
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

        event.currentTarget.reset(); // Erases input credentials fields safely out of view elements
    }

    return (
        <div className={styles.wrapper}>
            <MainContentPanel title={"Update Username"}>
                <div className={styles.section}>
                    <p className={styles.sectionSubtitle}>
                        This is the name that will be displayed across the app.
                    </p>
                    <form className={styles.form} onSubmit={handleProfileSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="name"> Username </label>
                            <input id="name"
                                   name="name"
                                   className={styles.input}
                                   defaultValue={currentName}
                                   placeholder="Your name"
                                   autoComplete="name"
                                   required/>
                        </div>
                        {profileState.error ? <p className={styles.error}>{profileState.error}</p> : null}
                        {profileState.success ? (<p className={styles.success}>{profileState.success}</p>) : null}
                        <div className={styles.actions}>
                            <button type="submit" className={styles.submit} disabled={profileState.loading}>
                                {profileState.loading ? "Saving..." : "Save username"}
                            </button>
                        </div>
                    </form>
                </div>
            </MainContentPanel>

            <MainContentPanel title={"Update Email"}>
                <div className={styles.section}>
                    <p className={styles.sectionSubtitle}>
                        We&apos;ll send a confirmation to your new address if verification is required.
                    </p>
                    <form className={styles.form} onSubmit={handleEmailSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="email"> Email </label>
                            <input id="email"
                                   name="email"
                                   type="email"
                                   className={styles.input}
                                   defaultValue={currentEmail}
                                   placeholder="you@example.com"
                                   autoComplete="email"
                                   required/>
                        </div>
                        {emailState.error ? <p className={styles.error}>{emailState.error}</p> : null}
                        {emailState.success ? <p className={styles.success}>{emailState.success}</p> : null}
                        <div className={styles.actions}>
                            <button type="submit" className={styles.submit} disabled={emailState.loading}>
                                {emailState.loading ? "Saving..." : "Update email"}
                            </button>
                        </div>
                    </form>
                </div>
            </MainContentPanel>

            <MainContentPanel title={"Update Password"}>
                <div className={styles.section}>
                    <p className={styles.sectionSubtitle}>
                        Use at least 8 characters. Updating your password will sign you out of other sessions.
                    </p>
                    <form className={styles.form} onSubmit={handlePasswordSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="currentPassword">
                                Current password
                            </label>
                            <input id="currentPassword"
                                   name="currentPassword"
                                   type="password"
                                   className={styles.input}
                                   autoComplete="current-password"
                                   required/>
                        </div>
                        <hr className={styles.divider}/>
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
                                <label className={styles.label} htmlFor="confirmPassword">
                                    Confirm new password
                                </label>
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
        </div>
    );
}
