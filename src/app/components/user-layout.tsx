import React from "react";

export default function AppLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <h1>UserLayout because you&#39;re logged in</h1>
            <div>{children}</div>
        </div>
    );
}