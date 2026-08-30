import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AppShell} from "@/core/dashboard/components/app-shell";
import {AccountSettingsForm} from "@/core/settings/components/account-settings-form";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
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

            <AppShell userName={session.user.name}
                      userEmail={session.user.email}
                      userRole={session.user.role}>
                <AccountSettingsForm currentName={session.user.name ?? ""}
                                     currentEmail={session.user.email}/>
            </AppShell>
        </div>
    );
}
