import {AdminPostingStatusForm} from "@/core/admin/components/admin-posting-status-form";
import {applyPostingStatusAction} from "@/core/admin/lib/actions";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import EditIcon from "@/shared/svg/bootstrap-edit-icon.svg";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the AdminUserDetailsPage component.
 *
 * @property {Promise<{ userId: string }>} params - A promise resolving to route parameters containing the targeted
 * user ID.
 */
type PageProps = {
    params: Promise<{ userId: string }>;
};

/**
 * Formats a raw date value into a localized date and time string
 *
 * @param {string | Date | null | undefined} value - The date value to format
 * @returns {string} The localized date and time string, or an em-dash ("—") if the input value is invalid or false
 */
function formatDate(value: string | Date | null | undefined): string {
    if (!value) return "—";
    return new Date(value).toLocaleString();
}

/**
 * A page that renders detailed profile, activity, and configuration options for a single user account.
 *
 * Secure processing flow:
 * 1. Resolves dynamic route parameters and request headers.
 * 2. Authenticates the ongoing user session, forcing a `/login` redirect if missing.
 * 3. Restricts page presentation exclusively to accounts with the `"admin"` role.
 * 4. Fetches the designated user profile data (returns 404 if data lookup drops or breaks).
 * 5. Pulls historical session records, computing the most recent active session timestamp.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ userId: string }>} props.params - Route parameter promise containing the ID of the user being viewed
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the admin user management profile viewport
 */
export default async function AdminUserDetailsPage({params}: PageProps): Promise<JSX.Element> {
    const {userId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    // TODO:: replace with centralized mechanism
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    let user;
    let sessions: Array<{
        createdAt: string | Date;
        updatedAt?: string | Date | null }> = [];

    // Fetch account details for the target user ID
    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error("[admin/details] getUser threw:", error);
        notFound();
    }

    // Enforce 404 layout if the target user profile cannot be located
    if (!user) {
        notFound();
    }

    // Fetch active session history for tracking administrative details
    try {
        const result = await auth.api.listUserSessions({
            body: {userId},
            headers: requestHeaders,
        });
        sessions = result.sessions;
    } catch (error) {
        console.error("[admin/details] listUserSessions failed", error);
    }

    // Isolate the single most recent session based on modern update or creation stamps
    const mostRecentSession = sessions
        .slice()
        .sort(
            (a, b) =>
                new Date(b.updatedAt || b.createdAt).getTime() -
                new Date(a.updatedAt || a.createdAt).getTime(),
        )[0];

    // Structured metadata dictionary optimized for grid dashboard data rendering
    const details = [
        {label: "User ID", value: user.id},
        {label: "Name", value: user.name || "—"},
        {label: "Email", value: user.email},
        {label: "Email verified", value: user.emailVerified ? "Yes" : "No"},
        {label: "Role", value: user.role || "user"},
        {
            label: "Status",
            value: user.banned
                ? `Banned${user.banReason ? ` (${user.banReason})` : ""}`
                : "Active",
        },
        {label: "Registered", value: formatDate(user.createdAt)},
        {label: "Last updated", value: formatDate(user.updatedAt)},
        {
            label: "Last active",
            value: mostRecentSession
                ? formatDate(mostRecentSession.updatedAt || mostRecentSession.createdAt)
                : "No recorded sessions",
        },
        {label: "Active sessions", value: String(sessions.length)},
    ];

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={userId} label={user.name ?? undefined}/>

            <PageHeader eyebrow={"Viewing Profile Details For..."}
                        title={user.name || user.email}
                        subtitle={"User details"}/>

            <MainContentPanel title={"User Details"}>
                <section className={styles.section}>
                    <dl className={styles.details}>
                        {details.map((item) => (
                            <div key={item.label} className={styles.detailRow}>
                                <dt className={styles.detailLabel}> {item.label} </dt>
                                <dd className={styles.detailValue}> {item.value} </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </MainContentPanel>

            <MainContentPanel title={"Admin Actions"}>
                <div className={styles.actions}>
                    <Link href={`/admin/${user.id}/edit`} className={styles.submit}>
                        <EditIcon/> Edit user
                    </Link>
                </div>
            </MainContentPanel>

            <AdminPostingStatusForm userId={user.id} onSubmitAction={applyPostingStatusAction}/>
        </div>
    );
}
