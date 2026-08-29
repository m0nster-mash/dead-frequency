import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import Link from "next/link";
import {auth} from "@/core/auth";
import {AppShell} from "@/core/dashboard/components/app-shell";
import {AdminEditUserForm} from "@/core/admin/components/admin-edit-user-form";

type PageProps = {
    params: Promise<{ userId: string }>;
};

export default async function AdminEditUserPage({params}: PageProps) {
    const {userId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    let user;

    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error("[admin/edit] getUser threw:", error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    return (
        <AppShell userName={session.user.name}
                  userEmail={session.user.email}
                  userRole={session.user.role}>
            <div>
                <header>
                    <Link href={`/dashboard/admin/${user.id}`}>
                        ← Back to user details
                    </Link>
                    <h1>Edit {user.name || user.email}</h1>
                    <p>Update this user&apos;s account details.</p>
                </header>

                <AdminEditUserForm userId={user.id}
                                   currentName={user.name ?? ""}
                                   currentEmail={user.email}
                                   currentRole={user.role ?? "user"}
                                   isCurrentUser={user.id === session.user.id}/>
            </div>
        </AppShell>
    );
}
