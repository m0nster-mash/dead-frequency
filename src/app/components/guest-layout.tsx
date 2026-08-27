import React from "react";
import styles from "./layout.module.css";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
			<h1 className={styles.heading}>go away</h1>
			<div>{children}</div>
		</div>
    );
}