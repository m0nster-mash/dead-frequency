import forumStyles from "@/feature/forum/styles/forum.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import cardStyles from "@/shared/styles/patterns/card.module.css";
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
        <section className={`${panelStyles.panel} ${panelStyles.panelPadded} ${panelStyles.panelRaised}`}>
            <div className={cardStyles.cardIntro}>
                <div>
                    <span className={cardStyles.cardEyebrow}>
                        {eyebrow}
                    </span>

                    <h2 className={cardStyles.cardTitleCompact}>
                        {title}
                    </h2>
                </div>
            </div>

            <div className={forumStyles.summaryGrid}>
                {stats.map((stat) => (
                    <div key={stat.label}
                         className={forumStyles.summaryStat}>
                        <span className={forumStyles.summaryValue}>
                            {stat.value}
                        </span>

                        <span className={forumStyles.metaLabel}>
                            {stat.label}
                        </span>
                    </div>
                ))}

                <div className={forumStyles.summaryRecent}>
                    <span className={forumStyles.metaLabel}>
                        {latestActivity.label || "Latest activity"}
                    </span>

                    <span className={forumStyles.recentThread}>
                        {latestActivity.title}
                    </span>

                    <span className={forumStyles.recentMeta}>
                        Last post by {latestActivity.user} ·{" "}
                        {latestActivity.time}
                    </span>
                </div>
            </div>
        </section>
    );
}
