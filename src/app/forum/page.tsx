import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BoardDisplay} from "@/feature/forum/components/board-display";
import {ForumStatsPanel} from "@/feature/forum/components/forum-stats-panel";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import styles from "@/feature/forum/styles/forum.module.css";
import {JSX} from "react";

/**
 * The central forum catalog directory landing view.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the primary systemic forum catalog dashboard directory UI.
 */
export default async function ForumIndexPage(): Promise<JSX.Element> {
    await requireSession();
    const categories = await getForumHierarchy();

    return (
        <div className={styles.wrapper}>

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
                    value: "[THREAD_TOTAL]",
                }, {
                    label: "Total posts",
                    value: "[POST_TOTAL]",
                },]}
                latestActivity={{
                    title: "[THREAD_NAME]",
                    user: "[LAST_USER_NAME]",
                    time: "[POST_TIME]",
                }}/>
        </div>
    );
}
