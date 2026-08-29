"use client";

import {useState} from "react";
import Link from "next/link";
import {DeleteUserModal} from "@/core/admin/components/delete-user-modal";

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

export function AdminUserTable({users, currentUserId}: AdminUserTableProps) {
    const [userPendingDelete, setUserPendingDelete] = useState<AdminUser | null>(null);

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name || "—"}</td>
                        <td>{user.email}</td>
                        <td><span>{user.role}</span></td>
                        <td>
                            {user.banned ? (<span>Banned</span>)
                                : (<span>Active</span>)}
                        </td>
                        <td>
                            <Link href={`/admin/${user.id}`}
                                  title="View details"
                                  aria-label={`View details for ${user.email}`}> 🔍 </Link>
                            <Link href={`/admin/${user.id}/edit`}
                                  title="Edit user"
                                  aria-label={`Edit ${user.email}`}> ✏️ </Link>
                            <button type="button"
                                    title="Delete user"
                                    aria-label={`Delete ${user.email}`}
                                    disabled={user.id === currentUserId}
                                    onClick={() => setUserPendingDelete(user)}> 🗑️
                            </button>
                        </td>
                    </tr>
                ))}
                {users.length === 0 && (
                    <tr>
                        <td colSpan={5}> No users found.</td>
                    </tr>
                )}
                </tbody>
            </table>
            {userPendingDelete && (
                <DeleteUserModal userId={userPendingDelete.id}
                                 userEmail={userPendingDelete.email}
                                 onCloseAction={() => setUserPendingDelete(null)}/>
            )}
        </div>
    );
}