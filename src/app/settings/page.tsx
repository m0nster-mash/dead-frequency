import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {AccountSettingsForm} from "@/core/settings/components/account-settings-form";
import {JSX} from "react";

/**
 * The profile and identity settings dashboard.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user account settings panel view.
 */
export default async function SettingsPage(): Promise<JSX.Element> {
    const session = await requireSession();
    const userName = session.user.name;
    const userEmail = session.user.email;

    return (
        <div>
            <PageHeader eyebrow={"Settings"}
                        title={"Account Settings"}
                        subtitle={"Update your username, email, and password."}/>

            <AccountSettingsForm currentName={userName ?? ""}
                                 currentEmail={userEmail}/>
        </div>
    );
}
