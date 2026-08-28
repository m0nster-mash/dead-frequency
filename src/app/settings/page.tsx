import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import AppShell from "@/core/dashboard/components/app-shell";

function AccountSettingsForm(props: { currentName: any, currentEmail: any }) {
    return null;
}

async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <AppShell userName={session.user.name}
                  userEmail={session.user.email}
                  userRole={session.user.role}>
            <div>
                <header>
                    <h1>Account Settings</h1>
                    <p>
                        Update your username, email, and password.
                    </p>
                </header>

                <AccountSettingsForm currentName={session.user.name ?? ""}
                                     currentEmail={session.user.email}/>
            </div>
        </AppShell>
    );
}