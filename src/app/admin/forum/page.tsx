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
import {auth} from "@/core/auth";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import styles from "@/shared/styles/form-panel.module.css";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * A page that initializes the forum hierarchy manager.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the layout container for forum configuration tools
 */
export default async function AdminForumManagementPage(): Promise<JSX.Element> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    // TODO:: replace with centralized mechanism
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

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
