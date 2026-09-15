import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {UserRole} from "@shared/constants/user-role";
import Link from "next/link";

/**
 * The primary administrator control panel.
 */
export default async function AdminPage() {
    await requireSession({role: UserRole.ADMIN});

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
