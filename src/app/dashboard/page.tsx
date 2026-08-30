import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {SignOutButton} from "@/core/auth/components/sign-out-button";
import {redirect} from "next/navigation";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {StatsGrid} from "@/core/dashboard/components/panels/stat-card";
import {ChartPanel} from "@/core/dashboard/components/panels/card-panel";
import {ActivityPanel} from "@/core/dashboard/components/panels/activity-panel";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import RequireAuth from "@/app/components/require-auth";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
       <RequireAuth session={session}>
            <PageHeader
                eyebrow="Overview"
                title="Good morning, <user>."
                subtitle="Here's what's happening across your workspace today."
            />
            <StatsGrid stats={[/* ... */]} />
            <section className="dashboard-grid">
                <ChartPanel
                    yAxisLabels={["$60k", "$45k", "$30k", "$15k", "$0"]}
                    xAxisLabels={["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
                    points="0,210 70,190 140,205 210,155 280,175 350,120 420,140 490,100 560,115 630,65 700,80 800,35"
                />
                <ActivityPanel items={[/* ... */]} />
            </section>

        </RequireAuth>
    );
}