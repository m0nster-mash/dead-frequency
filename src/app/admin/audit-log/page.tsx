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

export default async function AdminAuditLogPage({searchParams}: { searchParams: SearchParams }): Promise<JSX.Element> {
    await requireSession({role: "admin"});
    const params = await searchParams;

    const selectedModule = params.module && params.module !== "all" ? params.module : undefined;
    const selectedAction = params.action && params.action !== "all" ? params.action : undefined;

    const actorUser = alias(user, "actorUser");
    const targetUser = alias(user, "targetUser");

    const whereConditions = and(
        selectedModule ? eq(auditLog.targetModule, selectedModule) : undefined,
        selectedAction ? eq(auditLog.actionType, selectedAction) : undefined
    );

    const entries = await db
        .select({
            id: auditLog.id,
            actionType: auditLog.actionType,
            targetModule: auditLog.targetModule,
            targetRecordId: auditLog.targetRecordId,
            metadata: auditLog.metadata,
            createdAt: auditLog.createdAt,
            actorName: actorUser.name,
            actorEmail: actorUser.email,
            targetName: targetUser.name,
        })
        .from(auditLog)
        .leftJoin(actorUser, eq(auditLog.actorUserId, actorUser.id))
        .leftJoin(targetUser, eq(auditLog.targetUserId, targetUser.id))
        .where(whereConditions)
        .orderBy(desc(auditLog.createdAt))
        .limit(100);

    return (
        <div>
            <PageHeader eyebrow="Administration"
                        title="Audit Log"
                        subtitle="Immutable record of administrative and moderation actions"/>

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
                            <option value="USERS">Users</option>
                            <option value="FORUM_POST">Forum</option>
                            <option value="CHATBOX">Chatbox</option>
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
                            <option value="USER_EDITED">User Edited</option>
                            <option value="REPORT_RESOLVED">Report Resolved</option>
                            <option value="USER_MUTE">User Muted</option>
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

            <MainContentPanel title="Recent Audit Records">
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Module</th>
                            <th>Actor</th>
                            <th>Target</th>
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((e) => (
                            <tr key={e.id}>
                                <td>{new Date(e.createdAt).toLocaleString()}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{e.actionType}</span>
                                </td>
                                <td>{e.targetModule || "—"}</td>
                                <td>{e.actorName || e.actorEmail || "System"}</td>
                                <td>{e.targetName || "—"}</td>
                                <td>
                                    <code>{JSON.stringify(e.metadata || {})}</code>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={6} className={tableStyle.tableEmptyCell}>
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
