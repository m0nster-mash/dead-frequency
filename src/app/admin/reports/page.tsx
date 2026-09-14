import {user} from "@/core/auth/schema/auth.schema";
import {report} from "@/shared/communication/interactions/schema/interactions.schema";
import {db} from "@/shared/db/client";
import {resolveReportAction} from "@shared/communication/interactions/lib/actions";
import {desc, eq} from "drizzle-orm";

/**
 * The central moderation reports queue.
 */
export default async function AdminReportsPage() {
    const openReports = await db
        .select({
            id: report.id,
            module: report.module,
            recordId: report.recordId,
            reason: report.reason,
            details: report.details,
            resolved: report.resolved,
            createdAt: report.createdAt,
            reporterName: user.name,
            reporterEmail: user.email,
        })
        .from(report)
        .leftJoin(user, eq(report.reporterId, user.id))
        .orderBy(desc(report.createdAt));

    return (
        <div style={{padding: "2rem"}}>
            <h1>Content Moderation Queue</h1>
            <table style={{width: "100%", borderCollapse: "collapse", marginTop: "1rem"}}>
                <thead>
                <tr style={{textAlign: "left", borderBottom: "2px solid #ccc"}}>
                    <th>Module</th>
                    <th>Reason</th>
                    <th>Details</th>
                    <th>Reporter</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {openReports.length === 0 ? (
                    <tr>
                        <td colSpan={6} style={{padding: "1rem", textAlign: "center"}}>
                            No moderation reports found.
                        </td>
                    </tr>
                ) : (
                    openReports.map((item) => (
                        <tr key={item.id} style={{borderBottom: "1px solid #eee"}}>
                            <td style={{padding: "0.5rem"}}>{item.module}</td>
                            <td style={{padding: "0.5rem"}}>{item.reason}</td>
                            <td style={{padding: "0.5rem"}}>{item.details || "—"}</td>
                            <td style={{padding: "0.5rem"}}>{item.reporterName || item.reporterEmail}</td>
                            <td style={{padding: "0.5rem"}}>
                                <strong>{item.resolved}</strong>
                            </td>
                            <td style={{padding: "0.5rem"}}>
                                {item.resolved === "open" && (
                                    <div style={{display: "flex", gap: "0.5rem"}}>
                                        <form action={async () => {
                                            "use server";
                                            await resolveReportAction({reportId: item.id, status: "actioned"});
                                        }}>
                                            <button type="submit">Action</button>
                                        </form>
                                        <form action={async () => {
                                            "use server";
                                            await resolveReportAction({reportId: item.id, status: "dismissed"});
                                        }}>
                                            <button type="submit">Dismiss</button>
                                        </form>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
