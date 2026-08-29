import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import Link from "next/link";
import {auth} from "@/core/auth";
import {AppShell} from "@/core/dashboard/components/app-shell";

type PageProps = {
    params: Promise<{ userId: string }>;
};

function formatDate(value: string | Date | null | undefined) {
    if (!value) return "—";
    return new Date(value).toLocaleString();
}

export default async function AdminUserDetailsPage({params}: PageProps) {
    const {userId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    let user;
    let sessions: Array<{ createdAt: string | Date; updatedAt?: string | Date | null }> = [];

    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error("[admin/details] getUser threw:", error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    try {
        const result = await auth.api.listUserSessions({
            body: {userId},
            headers: requestHeaders,
        });
        sessions = result.sessions;
    } catch (error) {
        console.error("[admin/details] listUserSessions failed", error);
    }

    const mostRecentSession = sessions
        .slice()
        .sort(
            (a, b) =>
                new Date(b.updatedAt || b.createdAt).getTime() -
                new Date(a.updatedAt || a.createdAt).getTime(),
        )[0];

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
        <AppShell userName={session.user.name}
                  userEmail={session.user.email}
                  userRole={session.user.role}>
            <div>
                <header>
                    <Link href="/admin"> ← Back to Admin Panel </Link>
                    <h1>{user.name || user.email}</h1>
                    <p>User details</p>
                </header>

                <section>
                    <dl>
                        {details.map((item) => (
                            <div key={item.label}>
                                <dt>{item.label}</dt>
                                <dd>{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <div>
                    <Link href={`/admin/${user.id}/edit`}> ✏️ Edit user </Link>
                </div>
            </div>
        </AppShell>
    );
}
