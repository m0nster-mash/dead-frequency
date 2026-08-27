import React from "react";
import {auth} from "@core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {DashboardLayout} from "@/core/dashboard/components/dashboard-layout";
import styles from "./layout.module.css";

export default async function AppLayout({children}: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <DashboardLayout userName={session.user.name}
                         userEmail={session.user.email}
                         userRole={session.user.role}>
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>
                        Welcome back, {session.user.name ?? session.user.email}
                    </p>
                </header>
                <section className={styles.panel}>
                    <div>{children}</div>
                </section>
            </div>
        </DashboardLayout>
    );
}