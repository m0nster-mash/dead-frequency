import {requireSession} from "@/core/auth/lib/require-session";
import {user} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {auditLog} from "@/shared/communication/moderation/schema/moderation.schema";
import {db} from "@/shared/db/client";
import buttonStyle from "@/shared/styles/buttons.module.css";
import formStyle from "@/shared/styles/form.module.css";
import tableStyle from "@/shared/styles/tables.module.css";
import {and, desc, eq} from "drizzle-orm";
import {alias} from "drizzle-orm/pg-core";
import Link from "next/link";
import React, {JSX} from "react";

type SearchParams = Promise<{
    module?: string;
    action?: string;
}>;

/**
 * System-wide administrative audit log view.
 */
export default async function AdminAuditLogPage({
                                                    searchParams,
                                                }: {
    searchParams: SearchParams;
}): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const params = await searchParams;
    const selectedModule =
        params.module && params.module !== "all" ? params.module : undefined;
    const selectedAction =
        params.action && params.action !== "all" ? params.action : undefined;

    // Drizzle table aliases to join moderator and target user records
    const moderator = alias(user, "moderator");
    const targetUser = alias(user, "targetUser");

    // Dynamic Drizzle query conditions aligned with moderation.schema.ts
    const whereConditions = and(
        selectedModule ? eq(auditLog.targetModule, selectedModule) : undefined,
        selectedAction ? eq(auditLog.actionType, selectedAction) : undefined
    );

    const entries = await db
        .select({
            id: auditLog.id,
            targetModule: auditLog.targetModule,
            targetRecordId: auditLog.targetRecordId,
            actionType: auditLog.actionType,
            metadata: auditLog.metadata,
            createdAt: auditLog.createdAt,
            moderatorName: moderator.name,
            moderatorEmail: moderator.email,
            targetName: targetUser.name,
            targetEmail: targetUser.email,
        })
        .from(auditLog)
        .leftJoin(moderator, eq(auditLog.actorUserId, moderator.id))
        .leftJoin(targetUser, eq(auditLog.targetUserId, targetUser.id))
        .where(whereConditions)
        .orderBy(desc(auditLog.createdAt))
        .limit(100);

    return (
        <div>
            <PageHeader eyebrow="Administration"
                        title="Audit Log"
                        subtitle="Unified moderation history across every module"/>

            <MainContentPanel title="Filter Audit Records">
                <form method="GET" className={formStyle.filterForm}>
                    <div className={formStyle.field}>
                        <label htmlFor="module" className={formStyle.label}>
                            Module
                        </label>
                        <select id="module"
                                name="module"
                                defaultValue={selectedModule || "all"}
                                className={formStyle.select}>
                            <option value="all">All Modules</option>
                            <option value="chatbox">Chatbox</option>
                            <option value="forum">Forum</option>
                            <option value="avatar">Avatar</option>
                            <option value="users">Users</option>
                            <option value="auth">Auth</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div className={formStyle.field}>
                        <label htmlFor="action" className={formStyle.label}>
                            Action Type
                        </label>
                        <select id="action"
                                name="action"
                                defaultValue={selectedAction || "all"}
                                className={formStyle.select}>
                            <option value="all">All Actions</option>
                            <option value="delete">Delete</option>
                            <option value="restore">Restore</option>
                            <option value="edit">Edit</option>
                            <option value="ban">Ban</option>
                            <option value="mute">Mute</option>
                            <option value="role_change">Role Change</option>
                            <option value="inspect">Inspect</option>
                        </select>
                    </div>

                    <div className={formStyle.actions}>
                        <button type="submit"
                                className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                            Apply Filter
                        </button>
                        {(selectedModule || selectedAction) && (
                            <Link href="/admin/audit-log"
                                  className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}>
                                Reset
                            </Link>
                        )}
                    </div>
                </form>
            </MainContentPanel>

            <MainContentPanel title="Recent Mod Actions">
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>When</th>
                            <th>Module</th>
                            <th>Action</th>
                            <th>Moderator</th>
                            <th>Target User</th>
                            <th>Record ID</th>
                            <th>Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((e) => {
                            const reason = (e.metadata as { reason?: string } | null)?.reason;
                            return (
                                <tr key={e.id}>
                                    <td>{new Date(e.createdAt).toLocaleString()}</td>
                                    <td>
                                      <span className={tableStyle.statusBadge}>
                                        {e.targetModule || "—"}
                                      </span>
                                    </td>
                                    <td>{e.actionType}</td>
                                    <td>{e.moderatorName || e.moderatorEmail || "—"}</td>
                                    <td>{e.targetName || e.targetEmail || "—"}</td>
                                    <td>
                                        <code>{e.targetRecordId || "—"}</code>
                                    </td>
                                    <td>{reason || "—"}</td>
                                </tr>
                            );
                        })}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={7} className={tableStyle.tableEmptyCell}>
                                    No audit records match the selected filters.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
