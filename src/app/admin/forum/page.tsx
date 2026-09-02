import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";
import {AdminForumManagementPanel} from "@/core/admin/components/admin-forum-management-panel";
import {getForumHierarchy} from "@/feature/feature/forum/lib/queries";
import {
    createForumCategoryAction,
    updateForumCategoryAction,
    deleteForumCategoryAction,
    reorderForumCategoriesAction,
    createForumBoardAction,
    updateForumBoardAction,
    deleteForumBoardAction,
    moveForumBoardAction,
    reorderForumBoardsAction,
    removeBoardFromCategoryAction,
} from "@/core/admin/lib/forum-actions";

export default async function AdminForumManagementPage() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    if (!session?.user) redirect("/login");
    if (session.user.role !== "admin") redirect("/");

    const categories = await getForumHierarchy();

    return (
        <div className={styles.wrapper}>
            <PageHeader
                eyebrow={"Administration"}
                title={"Forum Management"}
                subtitle={"Manage forum categories and boards"}
            />
            <AdminForumManagementPanel
                categories={categories}
                createCategoryAction={createForumCategoryAction}
                updateCategoryAction={updateForumCategoryAction}
                deleteCategoryAction={deleteForumCategoryAction}
                reorderCategoriesAction={reorderForumCategoriesAction}
                createBoardAction={createForumBoardAction}
                updateBoardAction={updateForumBoardAction}
                deleteBoardAction={deleteForumBoardAction}
                moveBoardAction={moveForumBoardAction}
                reorderBoardsAction={reorderForumBoardsAction}
                removeBoardFromCategoryAction={removeBoardFromCategoryAction}
            />
        </div>
    );
}
