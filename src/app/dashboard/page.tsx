import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {SignOutButton} from "@/core/auth/components/sign-out-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <div>
            <p>Signed in as {session.user.email}</p>
            <p><SignOutButton/></p>
        </div>
    );
}