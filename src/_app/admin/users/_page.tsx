import {AdminUserTable} from "@/_core/admin/components/admin-user-table";
import {auth} from "@/_core/auth";
import {requireSession} from "@/_core/auth/lib/require-session";
import {PageHeader} from "@/_core/dashboard/components/panels/page-header";
import {headers} from "next/headers";
import {JSX} from "react";

/**
 * The primary administrator control panel.
 */
export default async function AdminPage(): Promise<JSX.Element> {
    const requestHeaders = await headers();
    const session = await requireSession({role: "admin"});

    // pulls the initial slice of registered users sorted chronologically
    const {users, total} = await auth.api.listUsers({
        query: {
            sortBy: "createdAt",
            sortDirection: "desc",
            limit: 10
        },
        headers: requestHeaders
    });

    // dynamic localization label generation handling pluralization formatting constraints
    const registeredUsers = total + " registered " + ((total == 1)
        ? "user"
        : "users");

    return (
        <div>
            <PageHeader eyebrow={"Administration"} title={"Admin Panel"} subtitle={registeredUsers}/>

            <AdminUserTable
                users={
                    users.map((user) => ({
                        id: user.id,
                        name: user.name ?? "",
                        email: user.email,
                        role: user.role ?? "user",
                        banned: Boolean(user.banned)
                    }))}
                currentUserId={session.user.id}/>
        </div>
    );
}
