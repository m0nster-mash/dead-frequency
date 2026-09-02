import {auth} from "@/core/auth";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {AccountSettingsForm} from "@/core/settings/components/account-settings-form";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * The profile and identity settings dashboard.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user account settings panel view
 */
export default async function SettingsPage(): Promise<JSX.Element> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div>
            <PageHeader eyebrow={"Settings"}
                        title={"Account Settings"}
                        subtitle={"Update your username, email, and password."}/>

            <AccountSettingsForm currentName={session.user.name ?? ""}
                                 currentEmail={session.user.email}/>
        </div>
    );
}
