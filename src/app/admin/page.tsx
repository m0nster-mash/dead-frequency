import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AdminUserTable} from "@/core/admin/components/admin-user-table";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";

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

    const registeredUsers = total + " registered " + ((total == 1) ? "user" : "users");

    return (
        <div>
            <PageHeader eyebrow={"Administration"} title={"Admin Panel"} subtitle={registeredUsers}/>
            <AdminUserTable
                users={users.map((user) => ({
                    id: user.id,
                    name: user.name ?? "",
                    email: user.email,
                    role: user.role ?? "user",
                    banned: Boolean(user.banned)
                }))} currentUserId={session.user.id}/>
        </div>
    );
}