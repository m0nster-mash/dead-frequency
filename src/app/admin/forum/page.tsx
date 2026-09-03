import {AdminForumManagementPanel} from "@/core/admin/components/admin-forum-management-panel";
import {
    createForumBoardAction,
    createForumCategoryAction,
    deleteForumBoardAction,
    deleteForumCategoryAction,
    moveForumBoardAction,
    removeBoardFromCategoryAction,
    reorderForumBoardsAction,
    reorderForumCategoriesAction,
    updateForumBoardAction,
    updateForumCategoryAction,
} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import styles from "@/shared/styles/form-panel.module.css";
import {JSX} from "react";

/**
 * Forum hierarchy manager.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the layout container for forum configuration tools.
 */
export default async function AdminForumManagementPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});
    const categories = await getForumHierarchy();

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Administration"}
                        title={"Forum Management"}
                        subtitle={"Manage forum categories and boards"}/>

            <AdminForumManagementPanel categories={categories}
                                       createCategoryAction={createForumCategoryAction}
                                       updateCategoryAction={updateForumCategoryAction}
                                       deleteCategoryAction={deleteForumCategoryAction}
                                       reorderCategoriesAction={reorderForumCategoriesAction}
                                       createBoardAction={createForumBoardAction}
                                       updateBoardAction={updateForumBoardAction}
                                       deleteBoardAction={deleteForumBoardAction}
                                       moveBoardAction={moveForumBoardAction}
                                       reorderBoardsAction={reorderForumBoardsAction}
                                       removeBoardFromCategoryAction={removeBoardFromCategoryAction}/>
        </div>
    );
}
