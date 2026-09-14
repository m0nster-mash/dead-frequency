import {AdminUserTable} from "@/core/admin/components/admin-user-table";
import {requireSession} from "@/core/auth/lib/require-session";
import {role, user, userRole} from "@/core/auth/schema/auth.schema";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import {eq} from "drizzle-orm";
import {JSX} from "react";

export default async function AdminUsersPage(): Promise<JSX.Element> {
    const session = await requireSession({role: "admin"});
    const usersList = await db.select().from(user);
    const rolesList = await db
        .select({
            userId: userRole.userId,
            roleName: role.name,
        })
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id));

    const rolesByUserId = rolesList.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.userId] = curr.roleName;
        return acc;
    }, {});

    return (
        <div>
            <PageHeader eyebrow="Administration"
                        title="User Directory"
                        subtitle="View and manage registered accounts"/>

            <AdminUserTable users={usersList.map((u) => ({
                id: u.id,
                name: u.name ?? "",
                email: u.email,
                role: rolesByUserId[u.id] ?? "Member",
                banned: false,
            }))} currentUserId={session.user.id}/>
        </div>
    );
}
