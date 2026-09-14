import { requireSession } from "@/core/auth/lib/require-session";
import { getUserDetails } from "@/core/auth/lib/get-user-details";
import { PageHeader } from "@/core/dashboard/components/panels/page-header";
import { MainContentPanel } from "@/core/dashboard/components/panels/main-card";
import { AdminEditUserForm } from "@/core/admin/components/admin-edit-user-form";
import { AdminPostingStatusForm } from "@/core/admin/components/admin-posting-status-form";
import { DeleteUserModal } from "@/core/admin/components/delete-user-modal";
import { JSX } from "react";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function AdminUserPage({ params }: Props): Promise<JSX.Element> {
    // 1. Enforce admin session
    await requireSession({ role: "admin" });

    // 2. Await Next.js 15 params and fetch centralized user details
    const { userId } = await params;
    const { user, roles, profile, stats } = await getUserDetails(userId);

    // Extract primary role ID for component form state
    const primaryRole = roles?.roleId || "member";

    return (
        <div>
            <PageHeader
                eyebrow="Administration"
                title={`Manage Account: ${user.name}`}
                subtitle={`System ID: ${user.id}`}
            />

            {/* Account Details & Role Management Form */}
            <MainContentPanel title="Account Details & Role Management">
                <AdminEditUserForm
                    user={{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: primaryRole,
                        bio: profile?.bio || "",
                    }}
                />
            </MainContentPanel>

            {/* Standing & Trust Metrics Form */}
            <MainContentPanel title="Standing & Trust Metrics">
                <AdminPostingStatusForm
                    userId={user.id}
                    stats={{
                        forumPostCount: stats.forumPostCount,
                        chatMessageCount: stats.chatMessageCount,
                        chatboxMessageCount: stats.chatboxMessageCount,
                        commentCount: stats.commentCount,
                        trustScore: stats.trustScore,
                    }}
                />
            </MainContentPanel>

            {/* Account Deactivation Modal */}
            <MainContentPanel title="Account Deactivation">
                <DeleteUserModal userId={user.id} userName={user.name} />
            </MainContentPanel>
        </div>
    );
}
