import {resolveReportAction} from "@/core/admin/lib/moderation-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {user} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {report} from "@/shared/communication/moderation/schema/moderation.schema";
import {db} from "@/shared/db/client";
import buttonStyle from "@/shared/styles/buttons.module.css";
import tableStyle from "@/shared/styles/tables.module.css";
import {desc, eq} from "drizzle-orm";
import {alias} from "drizzle-orm/pg-core";
import {JSX} from "react";

export default async function AdminReportsPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const reporterUser = alias(user, "reporterUser");
    const resolverUser = alias(user, "resolverUser");

    const reportsList = await db
        .select({
            id: report.id,
            targetModule: report.targetModule,
            targetRecordId: report.targetRecordId,
            reason: report.reason,
            status: report.status,
            resolutionNote: report.resolutionNote,
            createdAt: report.createdAt,
            reporterName: reporterUser.name,
            resolverName: resolverUser.name,
        })
        .from(report)
        .leftJoin(reporterUser, eq(report.reporterUserId, reporterUser.id))
        .leftJoin(resolverUser, eq(report.resolvedByUserId, resolverUser.id))
        .orderBy(desc(report.createdAt));

    return (
        <div>
            <PageHeader eyebrow="Administration"
                        title="Moderation Reports Queue"
                        subtitle="Review and resolve user-submitted content reports"/>

            <MainContentPanel title="Reports Queue">
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>Submitted</th>
                            <th>Module</th>
                            <th>Reporter</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reportsList.map((r) => (
                            <tr key={r.id}>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{r.targetModule}</span>
                                </td>
                                <td>{r.reporterName || "Anonymous"}</td>
                                <td>{r.reason}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{r.status}</span>
                                </td>
                                <td>
                                    {r.status === "PENDING" ? (
                                        <div className={buttonStyle.buttonGroup}>
                                            <form action={async () => {
                                                "use server";
                                                await resolveReportAction(r.id, "RESOLVED", "Action taken by admin");
                                            }}>
                                                <button type="submit"
                                                        className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                                                    Resolve
                                                </button>
                                            </form>

                                            <form action={async () => {
                                                "use server";
                                                await resolveReportAction(r.id, "DISMISSED", "Dismissed by admin");
                                            }}>
                                                <button type="submit"
                                                        className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}>
                                                    Dismiss
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <span>Resolved by {r.resolverName || "Admin"}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {reportsList.length === 0 && (
                            <tr>
                                <td colSpan={6} className={tableStyle.tableEmptyCell}>
                                    No pending or historical reports found.
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
