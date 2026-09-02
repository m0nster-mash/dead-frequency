import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";
import {role, userRole} from "@shared/communication/permissions/schema/permissions.schema";
import {userTrust} from "@shared/communication/status/schema/status.schema";
import {db} from "@shared/db/client";
import {eq} from "drizzle-orm";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the PublicProfilePage component.
 *
 * @property {Promise<{ userId: string }>} params - A promise resolving to the route parameters containing the
 * targeted user ID
 */
type PageProps = {
    params: Promise<{ userId: string }>;
};

/**
 * Publicly accessible member profile page.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ userId: string }>} props.params - Route parameter promise containing the user unique identifier
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the public member profile directory viewport
 */
export default async function PublicProfilePage({params}: PageProps): Promise<JSX.Element> {
    const {userId} = await params;
    const requestHeaders = await headers();
    let user;

    // Core profile lookup loop matching targeted URL parameters
    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders
        });
    } catch {
        notFound();
    }

    // Data Validation Guard: Throw a 404 response layout if the target account does not exist
    if (!user) {
        notFound();
    }

    // Relational Query: resolves specific text labels for assigned user roles via an inner join
    const roles =
        await db
            .select({label: role.label})
            .from(userRole)
            .innerJoin(role, eq(userRole.roleId, role.id))
            .where(eq(userRole.userId, userId));

    // Status Lookup: extracts structural engagement tracking metrics for the target account
    const [trust] =
        await db
            .select()
            .from(userTrust)
            .where(eq(userTrust.userId, userId))
            .limit(1);

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Profile"}
                        title={user.name || user.email}
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

                {/* TODO:: Post history section: once Task 4 forum lands, query forumPost where authorColumns.userId = userId, ordered by createdAt desc */}
            </MainContentPanel>
        </div>
    );
}
