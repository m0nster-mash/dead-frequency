import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {report} from "@shared/communication/interactions/schema/interactions.schema";
import {db} from "@shared/db/client";
import tableStyle from "@shared/styles/tables.module.css";
import {desc, eq} from "drizzle-orm";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Tthe central moderation reports queue.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the administrative user reports moderation viewport.
 */
export default async function AdminReportsPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    // DB Query Execution: Pulls open tickets matching status codes via Drizzle ORM
    const openReports =
        await db
            .select()
            .from(report)
            .where(eq(report.resolved, "open"))
            .orderBy(desc(report.createdAt))
            .limit(100);

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Reports Queue"}
                        subtitle={`${openReports.length} open reports`}/>

            <MainContentPanel title={"Open reports"}>
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>Module</th>
                            <th>Reason</th>
                            <th>Details</th>
                            <th>Reported</th>
                            <th className={tableStyle.tableActions}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {openReports.map((r) => (
                            <tr key={r.id}>
                                <td><span className={tableStyle.badgeTag}>{r.module}</span></td>
                                <td>{r.reason}</td>
                                <td>{r.details || "—"}</td>
                                <td>{new Date(r.createdAt).toLocaleString()}</td>
                                <td className={tableStyle.tableActions}>
                                    {/* TODO:: wire up server actions: mark actioned/dismissed, jump to record via module+recordId once module views exist */}
                                </td>
                            </tr>
                        ))}
                        {openReports.length === 0 && (
                            <tr>
                                <td colSpan={5} className={tableStyle.tableEmpty}>No open reports.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
