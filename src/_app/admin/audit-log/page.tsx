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
import {JSX} from "react";

type SearchParams = Promise<{
    module?: string;
    action?: string;
}>;

// Strongly-typed enum union types extracted from moderation schema
type AuditModule = (typeof auditLog.module.enumValues)[number];
type AuditAction = (typeof auditLog.action.enumValues)[number];

/**
 * The system audit log.
 */
export default async function AdminAuditLogPage({searchParams}: { searchParams: SearchParams; }): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const params = await searchParams;
    const selectedModule = params.module && params.module !== "all" ? params.module : undefined;
    const selectedAction = params.action && params.action !== "all" ? params.action : undefined;

    // Table aliases to join moderator and target user records
    const moderator = alias(user, "moderator");
    const targetUser = alias(user, "targetUser");

    // Dynamic Drizzle query conditions with explicit schema types (replaces `as any`)
    const whereConditions = and(
        selectedModule ? eq(auditLog.module, selectedModule as AuditModule) : undefined,
        selectedAction ? eq(auditLog.action, selectedAction as AuditAction) : undefined
    );

    const entries = await db
        .select({
            id: auditLog.id,
            module: auditLog.module,
            recordId: auditLog.recordId,
            action: auditLog.action,
            reason: auditLog.reason,
            createdAt: auditLog.createdAt,
            moderatorName: moderator.name,
            moderatorEmail: moderator.email,
            targetName: targetUser.name,
            targetEmail: targetUser.email,
        })
        .from(auditLog)
        .leftJoin(moderator, eq(auditLog.moderatorId, moderator.id))
        .leftJoin(targetUser, eq(auditLog.targetUserId, targetUser.id))
        .where(whereConditions)
        .orderBy(desc(auditLog.createdAt))
        .limit(100);

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Audit Log"}
                        subtitle={"Unified moderation history across every module"}/>

            <MainContentPanel title={"Filter Audit Records"}>
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
                        </select>
                    </div>

                    <div className={formStyle.actions}>
                        <button type="submit" className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                            Apply Filter
                        </button>
                        {(selectedModule || selectedAction) && (
                            <Link href="/admin/audit-log" className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}>
                                Reset
                            </Link>
                        )}
                    </div>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Recent Mod Actions"}>
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
                        {entries.map((e) => (
                            <tr key={e.id}>
                                <td>{new Date(e.createdAt).toLocaleString()}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{e.module}</span>
                                </td>
                                <td>{e.action}</td>
                                <td>{e.moderatorName || e.moderatorEmail || "—"}</td>
                                <td>{e.targetName || e.targetEmail || "—"}</td>
                                <td>
                                    <code>{e.recordId}</code>
                                </td>
                                <td>{e.reason || "—"}</td>
                            </tr>
                        ))}
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
