type ActivityItem = {
    initials: string;
    text: React.ReactNode;
    time: string;
};

type ActivityPanelProps = {
    title?: string;
    subtitle?: string;
    items: ActivityItem[];
    onViewAll?: () => void;
};

export function ActivityPanel({
                                  title = "Recent Activity",
                                  subtitle = "Latest workspace updates.",
                                  items,
                                  onViewAll,
                              }: ActivityPanelProps) {
    return (
        <article className="card activity-card">
            <div className="card-header">
                <div>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
                <button className="text-button" onClick={onViewAll}>
                    View all
                </button>
            </div>
            <div className="activity-list">
                {items.map((item, i) => (
                    <div className="activity-item" key={i}>
                        <div className="activity-avatar">{item.initials}</div>
                        <div className="activity-content">
                            <p>{item.text}</p>
                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}