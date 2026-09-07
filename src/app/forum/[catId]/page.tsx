import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BoardDisplay} from "@/feature/forum/components/board-display";
import {ForumStatsPanel} from "@/feature/forum/components/forum-stats-panel";
import {getCategoryWithBoards} from "@/feature/forum/lib/queries";
import styles from "@/feature/forum/styles/forum.module.css";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import Placeholder from "@shared/components/placeholder";
import {notFound} from "next/navigation";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Properties for the ForumCategoryPage component.
 *
 * @property {Promise<{ catId: string }>} params - A promise resolving to the dynamic path parameters.
 */
type PageProps = {
    params: Promise<{ catId: string }>;
};

/**
 * A directory of discussion boards within a specific forum category.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ catId: string }>} props.params - Route parameter promise containing the category unique identifier
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the sub-forum board registry directory layout
 */
export default async function ForumCategoryPage({params}: PageProps): Promise<JSX.Element> {
    await requireSession();
    const {catId} = await params;
    const category = await getCategoryWithBoards(catId);

    // throw a 404 response layout if the target category record cannot be located
    if (!category) {
        notFound();
    }

    const boards = category.boards.map((board) => ({
        id: board.id,
        name: board.label,
        description: board.description,
        href: `/forum/${category.id}/${board.id}`,
    }));

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={catId}
                             label={category.label}/>

            <PageHeader eyebrow="Forum"
                        title={category.label}
                        subtitle="Boards in this category"/>

            <MainContentPanel title="Boards">
                <BoardDisplay boards={boards}
                              emptyMessage="No boards in this category yet."/>
            </MainContentPanel>

            <ForumStatsPanel
                eyebrow="Category overview"
                title={`${category.label} activity`}
                stats={[
                    {
                        label: "Total boards",
                        value: <Placeholder text={"BOARD_TOTAL"}/>,
                    },
                    {
                        label: "Total threads",
                        value: <Placeholder text={"THREAD_TOTAL"}/>,
                    },
                ]}
                latestActivity={{
                    title: <Placeholder text={"THREAD_NAME"}/>,
                    user: <Placeholder text={"LAST_USER_NAME"}/>,
                    time: <Placeholder text={"POST_TIME"}/>,
                }}/>
        </div>
    );
}
