import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {db} from "@shared/db/client";
import {report} from "@shared/communication/interactions/schema/interactions.schema";
import {desc, eq} from "drizzle-orm";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";

export default async function AdminReportsPage() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) redirect("/login");
    if (session.user.role !== "admin") redirect("/");

    const openReports = await db
        .select()
        .from(report)
        .where(eq(report.resolved, "open"))
        .orderBy(desc(report.createdAt))
        .limit(100);

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Administration"} title={"Reports Queue"}
                        subtitle={`${openReports.length} open reports`}/>
            <MainContentPanel title={"Open reports"}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Module</th>
                            <th>Reason</th>
                            <th>Details</th>
                            <th>Reported</th>
                            <th className={styles.tableActions}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {openReports.map((r) => (
                            <tr key={r.id}>
                                <td><span className={styles.badge}>{r.module}</span></td>
                                <td>{r.reason}</td>
                                <td>{r.details || "—"}</td>
                                <td>{new Date(r.createdAt).toLocaleString()}</td>
                                <td className={styles.tableActions}>
                                    {/* wire up server actions: mark actioned/dismissed,
                                        jump to record via module+recordId once module views exist */}
                                </td>
                            </tr>
                        ))}
                        {openReports.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.tableEmpty}>No open reports.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
