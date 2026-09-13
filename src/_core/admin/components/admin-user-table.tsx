"use client";

import {DeleteUserModal} from "@/_core/admin/components/delete-user-modal";
import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import formStyles from "@/_shared/styles/form.module.css";
import panelStyles from "@/_shared/styles/panel.module.css";
import tableStyles from "@/_shared/styles/tables.module.css";
import EditIcon from "@/_shared/svg/bootstrap-edit-icon.svg";
import SearchIcon from "@/_shared/svg/bootstrap-search-icon.svg";
import TrashIcon from "@/_shared/svg/bootstrap-trash-icon.svg";
import Link from "next/link";
import {JSX, useState} from "react";

/**
 * Structural definition of a platform user record for administration context.
 *
 * @property {string} id - Unique operational identifier for the account.
 * @property {string} name - Display username signature, fallback to an empty string if unset.
 * @property {string} email - Primary communication and credential identity address.
 * @property {string} role - Security permission level tag (ex. "user", "admin").
 * @property {boolean} banned - Boolean flag marking systemic access restrictions.
 */
type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
};

/**
 * Properties for the AdminUserTable component.
 *
 * @property {AdminUser[]} users - Collection list of registered platform user records.
 * @property {string} currentUserId - Operational ID of the logged-in administrator to manage self-action rules.
 */
type AdminUserTableProps = {
    users: AdminUser[];
    currentUserId: string;
};

/**
 * An interactive Client Component data-grid summarizing active platform membership records. Provides navigational
 * routes to profile details, record editing, and quick action deletion workflows.
 *
 * @param {AdminUserTableProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual user directory grid component panel.
 */
export function AdminUserTable({users, currentUserId}: AdminUserTableProps): JSX.Element {
    const [userPendingDelete, setUserPendingDelete] = useState<AdminUser | null>(null);

    return (
        <MainContentPanel title={"User Table"}>
            <div>
                <p className={panelStyles.panelHeaderTitle}>
                    {users.length} registered{" "} {users.length === 1 ? "user" : "users"}.
                </p>
                <div className={tableStyles.tableWrapper}>
                    <table className={tableStyles.table}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className={tableStyles.tableActionsColumn}> Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name || "—"}</td>
                                <td>{user.email}</td>
                                <td><span className={tableStyles.badge}> {user.role} </span></td>
                                <td>
                                    <span className={`${tableStyles.statusBadge} ${user.banned
                                        ? tableStyles.statusBadgeDanger : tableStyles.statusBadgeSuccess}`}>
                                        {user.banned ? "Banned" : "Active"}
                                    </span>
                                </td>
                                <td className={tableStyles.tableActionsColumn}>
                                    <div className={tableStyles.statusBadge}>
                                        <Link href={`/admin/users/${user.id}`}
                                              className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                                              title="View details"
                                              aria-label={`View details for ${user.email}`}>
                                            <SearchIcon/>
                                        </Link>

                                        <Link href={`/admin/users/${user.id}/edit`}
                                              className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                                              title="Edit user"
                                              aria-label={`Edit ${user.email}`}>
                                            <EditIcon/>
                                        </Link>

                                        <button type="button"
                                                className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnDanger}`}
                                                title="Delete user"
                                                aria-label={`Delete ${user.email}`}
                                                disabled={user.id === currentUserId}
                                                onClick={() => setUserPendingDelete(user)}>
                                            <TrashIcon/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className={formStyles.tableEmpty}> No users found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {userPendingDelete && (
                    <DeleteUserModal userId={userPendingDelete.id}
                                     userEmail={userPendingDelete.email}
                                     onCloseAction={() => setUserPendingDelete(null)}/>
                )}
            </div>
        </MainContentPanel>
    );
}
