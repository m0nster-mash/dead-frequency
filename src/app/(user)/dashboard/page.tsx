import {auth} from "@core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import styles from "./dashboard.module.css";


export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const stats = [
        {label: "Active Frequencies", value: "12"},
        {label: "Unread Messages", value: "4"},
        {label: "Signal Strength", value: "87%"},
        {label: "Last Scan", value: "3 min ago"},
    ];

    const recentActivity = [
        {title: "New signal detected on 104.7 FM", time: "2 minutes ago"},
        {title: "Frequency 88.3 FM went silent", time: "18 minutes ago"},
        {title: "Message received from Station Alpha", time: "1 hour ago"},
        {title: "Scan completed — 3 new frequencies found", time: "3 hours ago"},
    ];
    return (

        <div>
            <section className={styles.statsGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.statCard}>
                        <span className={styles.statValue}>{stat.value}</span>
                        <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                ))}
            </section>
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Recent Activity</h2>
                <ul className={styles.activityList}>
                    {recentActivity.map((item) => (
                        <li key={item.title} className={styles.activityItem}>
                            <span className={styles.activityTitle}>{item.title}</span>
                            <span className={styles.activityTime}>{item.time}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}