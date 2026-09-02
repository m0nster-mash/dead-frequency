import {auth} from "@/core/auth";
import {user} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";
import {auditLog} from "@shared/communication/moderation/schema/moderation.schema";
import {db} from "@shared/db/client";
import {desc, eq} from "drizzle-orm";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * A page that fetches and renders a system audit log.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the administrative system-wide audit history dashboard UI
 */
export default async function AdminAuditLogPage(): Promise<JSX.Element> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    // TODO:: replace with centralized mechanism
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    // Projection reference block mapping relational structural bindings from schema imports
    const moderator = {
        id: user.id,
        name: user.name,
        email: user.email};

    // DB Query Execution: Pulls tracking entries, joining user meta fields via Drizzle ORM
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
        })
        .from(auditLog)
        .leftJoin(user, eq(auditLog.moderatorId, user.id))
        .orderBy(desc(auditLog.createdAt))
        .limit(100);

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Administration"} title={"Audit Log"}
                        subtitle={"Unified moderation history across every module"}/>

            <MainContentPanel title={"Recent mod actions"}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>When</th>
                            <th>Module</th>
                            <th>Action</th>
                            <th>Moderator</th>
                            <th>Reason</th>
                        </tr>
                        </thead>
                        <tbody>

                        {entries.map((e) => (
                            <tr key={e.id}>
                                <td>{new Date(e.createdAt).toLocaleString()}</td>
                                <td><span className={styles.badge}>{e.module}</span></td>
                                <td>{e.action}</td>
                                <td>{e.moderatorName || e.moderatorEmail || "—"}</td>
                                <td>{e.reason || "—"}</td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.tableEmpty}>
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
