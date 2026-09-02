import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AccountSettingsForm} from "@/core/settings/components/account-settings-form";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div>
            <PageHeader
                eyebrow={"Settings"}
                title={"Account Settings"}
                subtitle={"Update your username, email, and password."}/>

            <AccountSettingsForm currentName={session.user.name ?? ""}
                                 currentEmail={session.user.email}/>
        </div>
    );
}