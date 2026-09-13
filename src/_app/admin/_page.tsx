import {requireSession} from "@/_core/auth/lib/require-session";
import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import Link from "next/link";
import {JSX} from "react";

/**
 * The primary administrator control panel.
 */
export default async function AdminPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    return (
        <div>
            {/* TODO:: add proper clean menu */}
            <MainContentPanel title={"Admin Tools"}>
                <ul>
                    <li><Link href={"/admin/users"}>Users</Link></li>
                    <li><Link href={"/admin/audit-log"}>Audit-Log</Link></li>
                    <li><Link href={"/admin/reports"}>Reports</Link></li>
                    <li><Link href={"/admin/forum"}>Forum Management</Link></li>
                </ul>
            </MainContentPanel>
        </div>
    );
}
