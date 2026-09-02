import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {auth} from "@/core/auth";
import {db} from "@shared/db/client";
import {role, userRole} from "@shared/communication/permissions/schema/permissions.schema";
import {userTrust} from "@shared/communication/status/schema/status.schema";
import {eq} from "drizzle-orm";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";

type PageProps = {
    params: Promise<{ userId: string }>;
};

export default async function PublicProfilePage({params}: PageProps) {
    const {userId} = await params;
    const requestHeaders = await headers();

    let user;
    try {
        user = await auth.api.getUser({query: {id: userId}, headers: requestHeaders});
    } catch {
        notFound();
    }
    if (!user) notFound();

    const roles = await db
        .select({label: role.label})
        .from(userRole)
        .innerJoin(role, eq(userRole.roleId, role.id))
        .where(eq(userRole.userId, userId));

    const [trust] = await db
        .select()
        .from(userTrust)
        .where(eq(userTrust.userId, userId))
        .limit(1);

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Profile"} title={user.name || user.email}
                        subtitle={roles.map((r) => r.label).join(", ") || "Member"}/>
            <MainContentPanel title={"Overview"}>
                <dl className={styles.details}>
                    <div className={styles.detailRow}>
                        <dt className={styles.detailLabel}>Post count</dt>
                        <dd className={styles.detailValue}>{trust?.postCount ?? 0}</dd>
                    </div>
                    <div className={styles.detailRow}>
                        <dt className={styles.detailLabel}>Trust level</dt>
                        <dd className={styles.detailValue}>{trust?.trustLevel ?? "new"}</dd>
                    </div>
                </dl>
                {/* Post history section: once Task 4 forum lands, query forumPost
                    where authorColumns.userId = userId, ordered by createdAt desc */}
            </MainContentPanel>
        </div>
    );
}
