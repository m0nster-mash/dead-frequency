import {resolveReportAction} from "@/core/admin/lib/moderation-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {user} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import buttonStyle from "@/shared/styles/buttons.module.css";
import formStyle from "@/shared/styles/form.module.css";
import tableStyle from "@/shared/styles/tables.module.css";
import {report} from "@shared/communication/moderation/schema/moderation.schema";
import {and, desc, eq} from "drizzle-orm";
import {alias} from "drizzle-orm/pg-core";
import Link from "next/link";
import {JSX} from "react";

type SearchParams = Promise<{
    status?: string;
    module?: string;
}>;

/**
 * Moderation Reports Queue page.
 */
export default async function AdminReportsPage({
                                                   searchParams,
                                               }: {
    searchParams: SearchParams;
}): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    // Next.js 15 searchParams resolution
    const params = await searchParams;
    const selectedStatus = params.status && params.status !== "all" ? params.status : undefined;
    const selectedModule = params.module && params.module !== "all" ? params.module : undefined;

    // Table aliases to join reporter and resolver user records
    const reporterUser = alias(user, "reporterUser");
    const resolverUser = alias(user, "resolverUser");

    // Dynamic Drizzle query conditions matching moderation schema
    const whereConditions = and(
        selectedStatus ? eq(report.status, selectedStatus) : undefined,
        selectedModule ? eq(report.targetModule, selectedModule) : undefined
    );

    const reportsList = await db
        .select({
            id: report.id,
            targetModule: report.targetModule,
            targetRecordId: report.targetRecordId,
            reason: report.reason,
            status: report.status,
            resolutionNote: report.resolutionNote,
            createdAt: report.createdAt,
            resolvedAt: report.resolvedAt,
            reporterName: reporterUser.name,
            reporterEmail: reporterUser.email,
            resolverName: resolverUser.name,
            resolverEmail: resolverUser.email,
        })
        .from(report)
        .leftJoin(reporterUser, eq(report.reporterUserId, reporterUser.id))
        .leftJoin(resolverUser, eq(report.resolvedByUserId, resolverUser.id))
        .where(whereConditions)
        .orderBy(desc(report.createdAt))
        .limit(100);

    return (
        <div>
            <PageHeader
                eyebrow={"Administration"}
                title={"Moderation Reports"}
                subtitle={"Review and resolve user-submitted moderation tickets"}
            />

            <MainContentPanel title={"Filter Reports"}>
                <form method="GET" className={formStyle.filterForm}>
                    <div className={formStyle.field}>
                        <label htmlFor="status" className={formStyle.label}>
                            Status
                        </label>
                        <select id="status"
                                name="status"
                                defaultValue={selectedStatus || "all"}
                                className={formStyle.select}>
                            <option value="all">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="DISMISSED">Dismissed</option>
                        </select>
                    </div>

                    <div className={formStyle.field}>
                        <label htmlFor="module" className={formStyle.label}>
                            Target Module
                        </label>
                        <select id="module"
                                name="module"
                                defaultValue={selectedModule || "all"}
                                className={formStyle.select}>
                            <option value="all">All Modules</option>
                            <option value="FORUM_POST">Forum Post</option>
                            <option value="BLOG_POST">Blog Post</option>
                            <option value="COMMENT">Comment</option>
                            <option value="CHATBOX_MESSAGE">Chatbox Message</option>
                            <option value="USER_PROFILE">User Profile</option>
                            <option value="DM_CONVERSATION">DM Conversation</option>
                        </select>
                    </div>

                    <div className={formStyle.actions}>
                        <button type="submit" className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                            Apply Filter
                        </button>
                        {(selectedStatus || selectedModule) && (
                            <Link href="/admin/reports" className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}>
                                Reset
                            </Link>
                        )}
                    </div>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Reports Queue"}>
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>Submitted</th>
                            <th>Target Module</th>
                            <th>Record ID</th>
                            <th>Reporter</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Resolver / Notes</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reportsList.map((item) => (
                            <tr key={item.id}>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{item.targetModule}</span>
                                </td>
                                <td>
                                    <code>{item.targetRecordId}</code>
                                </td>
                                <td>{item.reporterName || item.reporterEmail || "—"}</td>
                                <td>{item.reason}</td>
                                <td>
                                    <span className={tableStyle.statusBadge}>{item.status}</span>
                                </td>
                                <td>
                                    {item.status !== "PENDING" ? (
                                        <div>
                                            <strong>{item.resolverName || item.resolverEmail || "System"}</strong>
                                            {item.resolutionNote && <div>{item.resolutionNote}</div>}
                                        </div>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                                <td>
                                    {item.status === "PENDING" ? (
                                        <div className={formStyle.actions}>
                                            <form action={resolveReportAction}>
                                                <input type="hidden" name="reportId" value={item.id}/>
                                                <button type="submit"
                                                        className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                                                    Resolve
                                                </button>
                                            </form>
                                            <form action={resolveReportAction}>
                                                <input type="hidden" name="reportId" value={item.id}/>
                                                <button type="submit"
                                                        className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}>
                                                    Dismiss
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                            </tr>
                        ))}
                        {reportsList.length === 0 && (
                            <tr>
                                <td colSpan={8} className={tableStyle.tableEmptyCell}>
                                    No reports match the selected filters.
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
