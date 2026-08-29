type ChartPanelProps = {
    title?: string;
    subtitle?: string;
    yAxisLabels: string[];
    xAxisLabels: string[];
    points: string; // svg polyline "points" attribute
};

export function ChartPanel({
                               title = "Revenue Overview",
                               subtitle = "Monthly performance for the current year.",
                               yAxisLabels,
                               xAxisLabels,
                               points,
                           }: ChartPanelProps) {
    return (
        <article className="card chart-card">
            <div className="card-header">
                <div>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
                <select className="select">
                    <option>Last 12 months</option>
                    <option>Last 6 months</option>
                    <option>Last 30 days</option>
                </select>
            </div>
            <div className="chart">
                <div className="chart-y-axis">
                    {yAxisLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
                <div className="chart-area">
                    <div className="chart-lines">
                        {yAxisLabels.map((_, i) => (
                            <span key={i}></span>
                        ))}
                    </div>
                    <svg className="chart-svg" viewBox="0 0 800 260" preserveAspectRatio="none">
                        <polyline
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="chart-labels">
                        {xAxisLabels.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}