export default function Sidebar() {
    return (
        <aside className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <a href="#" className="brand">
                    <span className="brand-mark">N</span>
                    <span className="brand-name">Nexus</span>
                </a>
                <button className="icon-button sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
            </div>
            <nav className="sidebar-nav">
                <p className="nav-label">Workspace</p>
                <a href="#" className="nav-item active">
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a href="#" className="nav-item">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 19V5"/>
                        <path d="M4 19h16"/>
                        <path d="M7 16l4-5 3 3 5-7"/>
                    </svg>
                    <span>Analytics</span>
                </a>
                <a href="#" className="nav-item">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 5h16v14H4z"/>
                        <path d="M8 9h8M8 13h5"/>
                    </svg>
                    <span>Projects</span>
                </a>
                <a href="#" className="nav-item">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Team</span>
                </a>
                <p className="nav-label nav-label-spaced">Management</p>
                <a href="#" className="nav-item">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3"/>
                        <path
                            d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.39 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 11c.25.6.84 1 1.5 1H21v2h-.1c-.66 0-1.25.4-1.5 1z"/>
                    </svg>
                    <span>Settings</span>
                </a>
                <a href="#" className="nav-item">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 4h16v16H4z"/>
                        <path d="M8 8h8M8 12h8M8 16h5"/>
                    </svg>
                    <span>Documents</span>
                </a>
            </nav>
            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="avatar">JD</div>
                    <div className="user-info">
                        <strong>Jordan Davis</strong>
                        <span>Administrator</span>
                    </div>
                    <button className="more-button" aria-label="More options">•••</button>
                </div>
            </div>
        </aside>
    );
}