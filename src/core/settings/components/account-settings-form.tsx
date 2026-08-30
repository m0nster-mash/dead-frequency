"use client";

import {SubmitEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";

type AccountSettingsFormProps = {
    currentName: string;
    currentEmail: string;
};

type SectionState = {
    loading: boolean;
    error: string | null;
    success: string | null;
};

const idleState: SectionState = {loading: false, error: null, success: null};

export function AccountSettingsForm({
                                        currentName,
                                        currentEmail,
                                    }: AccountSettingsFormProps) {
    const router = useRouter();

    const [profileState, setProfileState] = useState<SectionState>(idleState);
    const [emailState, setEmailState] = useState<SectionState>(idleState);
    const [passwordState, setPasswordState] = useState<SectionState>(idleState);

    async function handleProfileSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setProfileState({loading: true, error: null, success: null});

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();

        if (!name) {
            setProfileState({loading: false, error: "Username is required", success: null});
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

        setProfileState({loading: false, error: null, success: "Username updated"});
        router.refresh();
    }

    async function handleEmailSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setEmailState({loading: true, error: null, success: null});

        const formData = new FormData(event.currentTarget);
        const newEmail = String(formData.get("email") || "").trim();

        if (!newEmail) {
            setEmailState({loading: false, error: "Email is required", success: null});
            return;
        }

        if (newEmail === currentEmail) {
            setEmailState({loading: false, error: "That is already your email", success: null});
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

    async function handlePasswordSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordState({loading: true, error: null, success: null});

        const formData = new FormData(event.currentTarget);
        const currentPassword = String(formData.get("currentPassword") || "");
        const newPassword = String(formData.get("newPassword") || "");
        const confirmPassword = String(formData.get("confirmPassword") || "");

        if (newPassword !== confirmPassword) {
            setPasswordState({loading: false, error: "New passwords do not match", success: null});
            return;
        }

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
            revokeOtherSessions: true,
        });

        if (result.error) {
            setPasswordState({
                loading: false,
                error: result.error.message || "Failed to update password",
                success: null,
            });
            return;
        }

        setPasswordState({loading: false, error: null, success: "Password updated"});
        event.currentTarget.reset();
    }

    return (
        <div>
            <MainContentPanel title={"Update Username"}>
                <section>
                    <form onSubmit={handleProfileSubmit}>
                        <div>
                            <label htmlFor="name"> Username </label>
                            <input id="name"
                                   name="name"
                                   defaultValue={currentName}
                                   placeholder="Your name"
                                   autoComplete="name"
                                   required/>
                        </div>
                        {profileState.error ? <p>{profileState.error}</p> : null}
                        {profileState.success ? (<p>{profileState.success}</p>) : null}
                        <button type="submit" disabled={profileState.loading}>
                            {profileState.loading ? "Saving..." : "Save username"}
                        </button>
                    </form>
                </section>
            </MainContentPanel>

            <MainContentPanel title={"Update Email"}>
                <section>
                    <form onSubmit={handleEmailSubmit}>
                        <div>
                            <label htmlFor="email"> Email </label>
                            <input id="email"
                                   name="email"
                                   type="email"
                                   defaultValue={currentEmail}
                                   placeholder="you@example.com"
                                   autoComplete="email"
                                   required/>
                        </div>
                        {emailState.error ? <p>{emailState.error}</p> : null}
                        {emailState.success ? <p>{emailState.success}</p> : null}
                        <button type="submit" disabled={emailState.loading}>
                            {emailState.loading ? "Saving..." : "Update email"}
                        </button>
                    </form>
                </section>

            </MainContentPanel>
            <MainContentPanel title={"Update Password"}>
                <section>
                    <form onSubmit={handlePasswordSubmit}>
                        <div>
                            <label htmlFor="currentPassword">
                                Current password
                            </label>
                            <input id="currentPassword"
                                   name="currentPassword"
                                   type="password"
                                   autoComplete="current-password"
                                   required/>
                        </div>
                        <div>
                            <label htmlFor="newPassword"> New password </label>
                            <input id="newPassword"
                                   name="newPassword"
                                   type="password"
                                   autoComplete="new-password"
                                   required/>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">
                                Confirm new password
                            </label>
                            <input id="confirmPassword"
                                   name="confirmPassword"
                                   type="password"
                                   autoComplete="new-password"
                                   required/>
                        </div>
                        {passwordState.error ? <p>{passwordState.error}</p> : null}
                        {passwordState.success ? (<p>{passwordState.success}</p>) : null}
                        <button type="submit" disabled={passwordState.loading}>
                            {passwordState.loading ? "Saving..." : "Update password"}
                        </button>
                    </form>
                </section>
            </MainContentPanel>
        </div>
    );
}