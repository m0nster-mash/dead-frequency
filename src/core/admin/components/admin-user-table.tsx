"use client";

import {useState} from "react";
import Link from "next/link";
import {DeleteUserModal} from "@/core/admin/components/delete-user-modal";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/shared/styles/form-panel.module.css";

type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
};

type AdminUserTableProps = {
    users: AdminUser[];
    currentUserId: string;
};

export function AdminUserTable({users, currentUserId,}: AdminUserTableProps) {
    const [userPendingDelete, setUserPendingDelete] = useState<AdminUser | null>(null);
    return (<MainContentPanel title={"User Table"}>
        <div className={styles.section}><p
            className={styles.sectionSubtitle}> {users.length} registered{" "} {users.length === 1 ? "user" : "users"}. </p>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th className={styles.tableActions}> Actions</th>
                    </tr>
                    </thead>
                    <tbody> {users.map((user) => (<tr key={user.id}>
                        <td>{user.name || "—"}</td>
                        <td>{user.email}</td>
                        <td><span className={styles.badge}> {user.role} </span></td>
                        <td><span
                            className={`${styles.status} ${user.banned ? styles.statusBanned : styles.statusActive}`}> {user.banned ? "Banned" : "Active"} </span>
                        </td>
                        <td className={styles.tableActions}>
                            <div className={styles.iconActions}><Link href={`/admin/${user.id}`}
                                                                      className={styles.iconButton} title="View details"
                                                                      aria-label={`View details for ${user.email}`}> 🔍 </Link>
                                <Link href={`/admin/${user.id}/edit`} className={styles.iconButton} title="Edit user"
                                      aria-label={`Edit ${user.email}`}> ✏️ </Link>
                                <button type="button" className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                                        title="Delete user" aria-label={`Delete ${user.email}`}
                                        disabled={user.id === currentUserId}
                                        onClick={() => setUserPendingDelete(user)}> 🗑️
                                </button>
                            </div>
                        </td>
                    </tr>))} {users.length === 0 && (<tr>
                        <td colSpan={5} className={styles.tableEmpty}> No users found.</td>
                    </tr>)} </tbody>
                </table>
            </div>
            {userPendingDelete && (<DeleteUserModal userId={userPendingDelete.id} userEmail={userPendingDelete.email}
                                                    onCloseAction={() => setUserPendingDelete(null)}/>)} </div>
    </MainContentPanel>);
}