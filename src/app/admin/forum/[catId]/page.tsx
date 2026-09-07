import {deleteForumCategoryAction, updateForumCategoryAction,} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {EditCategoryPanel} from "@/feature/forum/components/admin/edit-category-panel";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import {JSX} from "react";

export default async function ViewCategoryPage(): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const categories = await getForumHierarchy();

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Forum Management"}
                        subtitle={"Manage forum categories and boards"}/>

            <EditCategoryPanel categories={categories}
                               updateCategoryAction={updateForumCategoryAction}
                               deleteCategoryAction={deleteForumCategoryAction}/>
        </div>
    );
}
