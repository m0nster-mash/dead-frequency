import React from "react";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
			<h1>GuestLayout because you&#39;re not logged in</h1>
			<div>{children}</div>
		</div>
    );
}