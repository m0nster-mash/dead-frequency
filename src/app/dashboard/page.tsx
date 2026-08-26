import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {SignOutButton} from "@/core/auth/components/sign-out-button";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <p>Signed in as {session.user.email}</p>
            <p><SignOutButton/></p>
        </div>
    );
}