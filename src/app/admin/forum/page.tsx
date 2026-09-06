import {createForumCategoryAction,} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {CreateCategoryPanel} from "@/feature/forum/components/admin/create-category-panel";
import {ViewForumPanel} from "@/feature/forum/components/admin/view-forum-panel";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
// import styles from "@/shared/styles/form-panel.module.css";
import styles from "@/shared/styles/form.module.css";
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
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Administration"}
                        title={"Forum Management"}
                        subtitle={"Manage forum categories and boards"}/>

            <div className={styles.content}>
                <CreateCategoryPanel createCategoryAction={createForumCategoryAction}/>

                <ViewForumPanel categories={categories}/>
            </div>
        </div>
    );
}
