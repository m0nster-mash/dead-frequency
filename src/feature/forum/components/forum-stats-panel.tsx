import styles from "@/feature/forum/styles/forum.module.css";
import {ReactNode} from "react";

export type ForumStat = {
    label: string;
    value: ReactNode;
};

export type ForumLatestActivity = {
    label?: string;
    title: ReactNode;
    user: ReactNode;
    time: ReactNode;
};

type ForumStatsPanelProps = {
    eyebrow?: string;
    title?: string;
    stats: ForumStat[];
    latestActivity: ForumLatestActivity;
};

export function ForumStatsPanel({
                                    eyebrow = "Forum overview",
                                    title = "Community activity",
                                    stats,
                                    latestActivity,
                                }: ForumStatsPanelProps) {
    return (
        <section className={styles.forumSummary}>
            <div className={styles.summaryHeader}>
                <div>
                    <span className={styles.summaryEyebrow}>
                        {eyebrow}
                    </span>

                    <h2 className={styles.summaryTitle}>
                        {title}
                    </h2>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                {stats.map((stat) => (
                    <div key={stat.label}
                         className={styles.summaryStat}>
                        <span className={styles.summaryValue}>
                            {stat.value}
                        </span>

                        <span className={styles.summaryLabel}>
                            {stat.label}
                        </span>
                    </div>
                ))}

                <div className={styles.summaryRecent}>
                    <span className={styles.summaryLabel}>
                        {latestActivity.label || "Latest activity"}
                    </span>

                    <span className={styles.recentThread}>
                        {latestActivity.title}
                    </span>

                    <span className={styles.recentMeta}>
                        Last post by {latestActivity.user} ·{" "}
                        {latestActivity.time}
                    </span>
                </div>
            </div>
        </section>
    );
}
