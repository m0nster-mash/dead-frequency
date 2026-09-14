import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {AccountSettingsForm} from "@/core/settings/components/account-settings-form";

/**
 * The profile and identity settings dashboard.
 */
export default async function SettingsPage() {
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
