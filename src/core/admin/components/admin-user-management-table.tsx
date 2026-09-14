"use client";

import { useState } from "react";
import { updateUserAdminAction } from "../lib/admin-user-actions";
import tableStyle from "@/shared/styles/tables.module.css";
import formStyle from "@/shared/styles/form.module.css";
import buttonStyle from "@/shared/styles/buttons.module.css";

export interface AdminUserRow {
    id: string;
    name: string;
    email: string;
    roles: string[];
    bio: string;
    createdAt: Date;
}

interface Props {
    users: AdminUserRow[];
}

type EditableField = "name" | "email" | "bio" | "role";

export function AdminUserManagementTable({ users }: Props) {
    // Fix 1: Access the first element of the array (users?.id)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(
        users?.id || null
    );
    const [editingCell, setEditingCell] = useState<{
        userId: string;
        field: EditableField;
    } | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const startEditing = (
        userId: string,
        field: EditableField,
        currentValue: string
    ) => {
        setEditingCell({ userId, field });
        setEditValue(currentValue);
    };

    const cancelEditing = () => {
        setEditingCell(null);
        setEditValue("");
    };

    const handleSave = async (userId: string, field: EditableField) => {
        setLoading(true);
        try {
            await updateUserAdminAction({
                targetUserId: userId,
                field,
                newValue: editValue,
            });
            setEditingCell(null);
        } catch {
            alert("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    const selectedUser = users.find((u) => u.id === selectedUserId);

    return (
        <div>
            {/* Primary User Directory Table */}
            <div className={tableStyle.tableWrapper}>
                <table className={tableStyle.table}>
                    <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Primary Role</th>
                        <th>Bio</th>
                        <th>Joined</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => {
                        // Fix 2: Extract primary role string from the string[] array
                        const primaryRole = u.roles || "member";

                        return (
                            <tr key={u.id} onClick={() => setSelectedUserId(u.id)}>
                                <td>
                                    <code>{u.id}</code>
                                </td>

                                {/* Name Cell */}
                                <td>
                                    {editingCell?.userId === u.id &&
                                    editingCell.field === "name" ? (
                                        <div
                                            className={formStyle.inlineForm}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className={formStyle.input}
                                            />
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleSave(u.id, "name")}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span onClick={() => startEditing(u.id, "name", u.name)}>
                        <strong>{u.name}</strong> ✎
                      </span>
                                    )}
                                </td>

                                {/* Email Cell */}
                                <td>
                                    {editingCell?.userId === u.id &&
                                    editingCell.field === "email" ? (
                                        <div
                                            className={formStyle.inlineForm}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="email"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className={formStyle.input}
                                            />
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleSave(u.id, "email")}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span onClick={() => startEditing(u.id, "email", u.email)}>
                        {u.email} ✎
                      </span>
                                    )}
                                </td>

                                {/* Role Cell */}
                                <td>
                                    {editingCell?.userId === u.id &&
                                    editingCell.field === "role" ? (
                                        <div
                                            className={formStyle.inlineForm}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <select
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className={formStyle.select}
                                            >
                                                <option value="member">Member</option>
                                                <option value="moderator">Moderator</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleSave(u.id, "role")}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span
                                            className={tableStyle.statusBadge}
                                            onClick={() => startEditing(u.id, "role", primaryRole)}
                                        >
                        {primaryRole} ✎
                      </span>
                                    )}
                                </td>

                                {/* Bio Cell */}
                                <td>
                                    {editingCell?.userId === u.id &&
                                    editingCell.field === "bio" ? (
                                        <div
                                            className={formStyle.inlineForm}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className={formStyle.input}
                                            />
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleSave(u.id, "bio")}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <span onClick={() => startEditing(u.id, "bio", u.bio)}>
                        {u.bio || <em>No bio set</em>} ✎
                      </span>
                                    )}
                                </td>

                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Selected User Overview */}
            {selectedUser && (
                <div>
                    <h3>Selected User: {selectedUser.name}</h3>
                    <p>
                        <strong>ID:</strong> <code>{selectedUser.id}</code> &bull;{" "}
                        <strong>Email:</strong> {selectedUser.email} &bull;{" "}
                        <strong>Assigned Roles:</strong> {selectedUser.roles.join(", ") || "member"}
                    </p>
                    <p>
                        <strong>Bio:</strong> {selectedUser.bio || <em>No bio set</em>}
                    </p>
                </div>
            )}
        </div>
    );
}
