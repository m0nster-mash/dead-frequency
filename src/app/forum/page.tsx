import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import Placeholder from "@/shared/components/placeholder";
import {JSX} from "react";
import {BoardDisplay} from "../../../packages/feature-forum/src/components/board-display";
import {ForumStatsPanel} from "../../../packages/feature-forum/src/components/forum-stats-panel";
import {getForumHierarchy} from "../../../packages/feature-forum/src/lib/queries";

/**
 * The central forum catalog directory landing view.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the primary systemic forum catalog dashboard directory UI.
 */
export default async function ForumIndexPage(): Promise<JSX.Element> {
    await requireSession();
    const categories = await getForumHierarchy();

    return (
        <div>
            <PageHeader eyebrow="Communication"
                        title="Forum"
                        subtitle="Browse categories and boards"/>

            {categories.map((category) => {
                const boards = category.boards.map(
                    (board) => ({
                        id: board.id,
                        name: board.label,
                        description: board.description,
                        href: `/forum/${category.id}/${board.id}`,
                    }));
                return (
                    <MainContentPanel key={category.id} title={category.label}>
                        <BoardDisplay boards={boards}/>
                    </MainContentPanel>);
            })}
            {categories.length === 0 && (
                <MainContentPanel title="No categories yet">
                    <p>Check back soon.</p>
                </MainContentPanel>)}

            <ForumStatsPanel
                stats={[{
                    label: "Total threads",
                    value: <Placeholder text={"THREAD_TOTAL"}/>,
                }, {
                    label: "Total posts",
                    value: <Placeholder text={"POST_TOTAL"}/>,
                },]}
                latestActivity={{
                    title: <Placeholder text={"THREAD_NAME"}/>,
                    user: <Placeholder text={"LAST_USER_NAME"}/>,
                    time: <Placeholder text={"POST_TIME"}/>,
                }}/>
        </div>
    );
}
