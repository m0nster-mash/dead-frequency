import {ReactNode} from "react";

type StatCardProps = {
    label: string;
    value: string;
    change: string;
    trend: "positive" | "negative";
    icon: ReactNode;
};

export function StatCard({label, value, change, trend, icon}: StatCardProps) {
    return (
        <article className="stat-card">
            <div className="stat-card-top">
                <span className="stat-label">{label}</span>
                <span className="stat-icon">{icon}</span>
            </div>
            <div className="stat-value">{value}</div>
            <div className={`stat-change ${trend}`}>
                {change} <span>vs last month</span>
            </div>
        </article>
    );
}

type StatsGridProps = {
    stats: StatCardProps[];
};

export function StatsGrid({stats}: StatsGridProps) {
    return (
        <section className="stats-grid">
            {stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}
        </section>
    );
}