import {AdminUserTable} from "@/core/admin/components/admin-user-table";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * A page serving as the primary administrator control panel.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the main administrative landing layout view
 */
export default async function AdminPage(): Promise<JSX.Element> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    // TODO:: replace with centralized mechanism
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    // API Query Execution: Pulls the initial slice of registered users sorted chronologically
    const {users, total} = await auth.api.listUsers({
        query: {
            sortBy: "createdAt",
            sortDirection: "desc",
            limit: 10
        },
        headers: requestHeaders
    });

    // Dynamic localization label generation handling pluralization formatting constraints
    const registeredUsers = total + " registered " + ((total == 1) ? "user" : "users");

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Administration"} title={"Admin Panel"} subtitle={registeredUsers}/>

            {/* TODO:: add proper clean menu */}
            <MainContentPanel title={"Admin Tools"}>
                <ul>
                    <li><Link href={"/admin/audit-log"}>Audit-Log</Link></li>
                    <li><Link href={"/admin/reports"}>Reports</Link></li>
                    <li><Link href={"/admin/forum"}>Forum Management</Link></li>
                </ul>
            </MainContentPanel>

            <AdminUserTable
                users={users.map((user) => ({
                    id: user.id,
                    name: user.name ?? "",
                    email: user.email,
                    role: user.role ?? "user",
                    banned: Boolean(user.banned)
                }))}
                currentUserId={session.user.id}
            />
        </div>
    );
}
