import {requireSession} from "@/_core/auth/lib/require-session";
import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import {PageHeader} from "@/_core/dashboard/components/panels/page-header";
import {ThreadAdminButton} from "@/_feature/forum/components/admin/thread-admin-button";
import {CreatePostPanel} from "@/_feature/forum/components/create-post-panel";
import {ForumStatsPanel} from "@/_feature/forum/components/forum-stats-panel";
import {createThreadAction} from "@/_feature/forum/lib/actions";
import {getBoardWithThreads} from "@/_feature/forum/lib/queries";
import forumStyles from "@/_feature/forum/styles/forum.module.css";
import {_breadcrumbLabel} from "@/_shared/components/_breadcrumb-label";
import tableStyles from "@/_shared/styles/tables.module.css";
import Placeholder from "@/_shared/components/placeholder";
import Link from "next/link";
import {notFound} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the ForumBoardPage component.
 *
 * @property {Promise<{ catId: string; boardId: string }>} params - A promise resolving to the dynamic path parameters.
 */
type PageProps = {
    params: Promise<{ catId: string; boardId: string }>;
};

/**
 * Presents a list of discussion threads inside a specific board along with a thread composition utility.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ catId: string; boardId: string }>} props.params - Route parameter promise containing structural
 *                                                                     hierarchy IDs
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the forum board portal and thread directory UI.
 */
export default async function ForumBoardPage({params}: PageProps): Promise<JSX.Element> {
    await requireSession();
    const {catId, boardId} = await params;
    const board = await getBoardWithThreads(boardId);

    if (!board || board.categoryId !== catId) {
        notFound();
    }

    return (
        <div className={forumStyles.wrapper}>

            <_breadcrumbLabel segment={boardId}
                              label={board.label}/>

            <PageHeader eyebrow="Forum"
                        title={board.label}
                        subtitle={board.description || "Threads in this board"}/>

            <MainContentPanel title="Threads">
                <div className={forumStyles.threadList}>
                    {board.threads.map((thread) => (
                        <article key={thread.id} className={forumStyles.threadRow}>
                            <div className={forumStyles.threadMain}>
                                <div className={forumStyles.threadTitleRow}>
                                    {thread.pinned && (
                                        <span className={tableStyles.badgeTag}>
                                            Pinned
                                        </span>
                                    )}

                                    <Link href={`/forum/${catId}/${boardId}/thread/${thread.id}`}
                                          className={forumStyles.threadTitle}>
                                        {thread.title}
                                    </Link>

                                    <ThreadAdminButton threadId={thread.id} threadTitle={thread.title}/>
                                </div>

                                <div className={forumStyles.threadMeta}>
                                    Started by{" "}
                                    <span className={forumStyles.threadAuthor}>
                                        {thread.authorName || thread.authorEmail || "—"}
                                    </span>
                                </div>
                            </div>

                            <div className={forumStyles.threadReplies}>
                                <span className={forumStyles.threadStatValue}>
                                    {Math.max(0, thread.postCount - 1)}
                                </span>
                                <span className={`${forumStyles.metaLabel} ${forumStyles.metaLabelSm}`}>
                                    Replies
                                </span>
                            </div>

                            <div className={forumStyles.threadActivity}>
                                <span className={`${forumStyles.metaLabel} ${forumStyles.metaLabelSm}`}>
                                    Last activity
                                </span>

                                <span className={forumStyles.threadActivityUser}>
                                    <Placeholder text={"LAST_USER_NAME"}/>
                                </span>

                                <span className={forumStyles.threadActivityTime}>
                                    {new Date(thread.lastPostAt).toLocaleString()}
                                </span>
                            </div>
                        </article>
                    ))}

                    {board.threads.length === 0 && (
                        <div className={forumStyles.discussionEmpty}>
                            No threads yet. Be the first to post.
                        </div>
                    )}
                </div>
            </MainContentPanel>

            <CreatePostPanel action={async (formData) => {
                "use server";

                await createThreadAction({
                    boardId,
                    title: String(formData.get("title") || ""),
                    body: String(formData.get("body") || ""),
                });
            }}/>

            <ForumStatsPanel
                eyebrow="Category overview"
                title={`${board.label} activity`}
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
