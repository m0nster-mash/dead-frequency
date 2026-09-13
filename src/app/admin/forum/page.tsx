import {createForumBoardAction, createForumCategoryAction,} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {JSX} from "react";
import {CreateBoardPanel} from "../../../../packages/feature-forum/src/components/admin/create-board-panel";
import {CreateCategoryPanel} from "../../../../packages/feature-forum/src/components/admin/create-category-panel";
import {ViewForumPanel} from "../../../../packages/feature-forum/src/components/admin/view-forum-panel";
import {getForumHierarchy} from "../../../../packages/feature-forum/src/lib/queries";

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
