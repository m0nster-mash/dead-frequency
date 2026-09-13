import {requireSession} from "@/core/auth/lib/require-session";
import {user} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {auditLog} from "@/shared/communication/moderation/schema/moderation.schema";
import {db} from "@/shared/db/client";
import tableStyle from "@/shared/styles/tables.module.css";
import {desc, eq} from "drizzle-orm";
import {alias} from "drizzle-orm/pg-core";
import {JSX} from "react";

/**
 * The system audit log page with detailed moderation tracking.
 */
export default async function AdminAuditLogPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const moderator = alias(user, "moderator");
    const targetUser = alias(user, "targetUser");

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
        .orderBy(desc(auditLog.createdAt))
        .limit(100);

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Audit Log"}
                        subtitle={"Unified moderation history across every module"}/>

            <MainContentPanel title={"Recent mod actions"}>
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
                                    No mod actions recorded yet.
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
