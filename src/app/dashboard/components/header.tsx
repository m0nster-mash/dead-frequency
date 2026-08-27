export default function Header() {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="breadcrumb">
                    <strong>Dashboard</strong>
                </div>
            </div>
            <div className="topbar-right">
                <button className="icon-button notification-button" aria-label="Notifications">
                    <svg viewBox="0 0 24 24">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                        <path d="M10 21h4"/>
                    </svg>
                    <span className="notification-dot"></span>
                </button>
                <div className="topbar-avatar">SP</div>
            </div>
        </header>
    );
}