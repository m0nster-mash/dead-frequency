import {createForumBoardAction, createForumCategoryAction,} from "@/_core/admin/lib/forum-actions";
import {requireSession} from "@/_core/auth/lib/require-session";
import {PageHeader} from "@/_core/dashboard/components/panels/page-header";
import {CreateBoardPanel} from "@/_feature/forum/components/admin/create-board-panel";
import {CreateCategoryPanel} from "@/_feature/forum/components/admin/create-category-panel";
import {ViewForumPanel} from "@/_feature/forum/components/admin/view-forum-panel";
import {getForumHierarchy} from "@/_feature/forum/lib/queries";
import {JSX} from "react";

/**
 * Forum hierarchy manager.
 *
 * @returns {Promise<JSX.Element>} Forum administration page.
 */
export default async function AdminForumManagementPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const categories = await getForumHierarchy();

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Forum Management"}
                        subtitle={"Manage forum categories and boards"}/>
            <CreateCategoryPanel createCategoryAction={createForumCategoryAction}/>
            <CreateBoardPanel createBoardAction={createForumBoardAction}/>
            <ViewForumPanel categories={categories}/>
        </div>
    );
}
