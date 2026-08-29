import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AppShell} from "@/core/dashboard/components/app-shell";
import {AdminUserTable} from "@/core/admin/components/admin-user-table";

export default async function AdminPage() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    const {users, total} = await auth.api.listUsers({
        query: {
            sortBy: "createdAt",
            sortDirection: "desc",
            limit: 10
        },
        headers: requestHeaders
    });

    return (
        <AppShell
            userName={session.user.name}
            userEmail={session.user.email}
            userRole={session.user.role}>

            <div>
                <header>
                    <h1>Admin Panel</h1>
                    <p>
                        {total} registered {total == 1 ? "user" : "users"}
                    </p>
                </header>

                <AdminUserTable
                    users={users.map((user) => ({
                        id: user.id,
                        name: user.name ?? "",
                        email: user.email,
                        role: user.role ?? "user",
                        banned: Boolean(user.banned)
                    }))} currentUserId={session.user.id}/>
            </div>
        </AppShell>
    );
}