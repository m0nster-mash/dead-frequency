import {AdminUserTable} from "@/core/admin/components/admin-user-table";
import {requireSession} from "@/core/auth/lib/require-session";
import {role, user, userRole} from "@/core/auth/schema/auth.schema";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import {UserRole} from "@shared/constants/user-role";
import {eq} from "drizzle-orm";

export default async function AdminUsersPage() {
    const session = await requireSession({role: UserRole.ADMIN});
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

            <AdminUserTable users={usersList.map((user) => ({
                id: user.id,
                name: user.name ?? "",
                email: user.email,
                role: rolesByUserId[user.id] ?? UserRole.USER,
                banned: false,
            }))} currentUserId={session.user.id}/>
        </div>
    );
}
