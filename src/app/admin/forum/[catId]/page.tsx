import {
    createForumBoardAction,
    deleteForumCategoryAction,
    updateForumCategoryAction,
} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {notFound} from "next/navigation";
import {JSX} from "react";
import {CreateBoardPanel} from "../../../../../packages/feature-forum/src/components/admin/create-board-panel";
import {EditCategoryPanel} from "../../../../../packages/feature-forum/src/components/admin/edit-category-panel";
import {getForumHierarchy} from "../../../../../packages/feature-forum/src/lib/queries";

type Props = {
    params: Promise<{
        catId: string;
    }>;
};

export default async function ViewCategoryPage({params}: Props): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const {catId} = await params;
    const categories = await getForumHierarchy();
    const category = categories.find((cat) => cat.id === catId);

    if (!category) {
        notFound();
    }

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Manage Category"}
                        subtitle={`Manage boards in ${category.label}`}/>

            <CreateBoardPanel createBoardAction={createForumBoardAction}
                              categories={categories}
                              defaultCategoryId={catId}/>

            <EditCategoryPanel categories={categories}
                               updateCategoryAction={updateForumCategoryAction}
                               deleteCategoryAction={deleteForumCategoryAction}/>
        </div>
    );
}
