import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {CreatePostPanel} from "@/feature/forum/components/create-post-panel";
import {ForumStatsPanel} from "@/feature/forum/components/forum-stats-panel";
import {ThreadAdminButton} from "@/feature/forum/components/thread-admin-button";
import {createThreadAction} from "@/feature/forum/lib/actions";
import {getBoardWithThreads} from "@/feature/forum/lib/queries";
import styles from "@/feature/forum/styles/forum.module.css";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
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
        <div className={styles.wrapper}>

            <BreadcrumbLabel segment={boardId}
                             label={board.label}/>

            <PageHeader eyebrow="Forum"
                        title={board.label}
                        subtitle={board.description || "Threads in this board"}/>

            <MainContentPanel title="Threads">
                <div className={styles.threadList}>
                    {board.threads.map((thread) => (
                        <article key={thread.id} className={styles.thread}>
                            <div className={styles.threadMain}>
                                <div className={styles.threadTitleRow}>
                                    {thread.pinned && (
                                        <span className={styles.badge}>
                                            Pinned
                                        </span>
                                    )}

                                    <Link href={`/forum/${catId}/${boardId}/thread/${thread.id}`}
                                          className={styles.threadTitle}>
                                        {thread.title}
                                    </Link>

                                    <ThreadAdminButton threadId={thread.id} threadTitle={thread.title}/>
                                </div>

                                <div className={styles.threadMeta}>
                                    Started by{" "}
                                    <span className={styles.threadAuthor}>
                                        {thread.authorName || thread.authorEmail || "—"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.threadReplies}>
                                <span className={styles.threadStatValue}>
                                    {Math.max(0, thread.postCount - 1)}
                                </span>
                                <span className={styles.threadStatLabel}>
                                    Replies
                                </span>
                            </div>

                            <div className={styles.threadActivity}>
                                <span className={styles.threadStatLabel}>
                                    Last activity
                                </span>

                                <span className={styles.threadActivityUser}>
                                    [LAST_USER_NAME]
                                </span>

                                <span className={styles.threadActivityTime}>
                                    {new Date(thread.lastPostAt).toLocaleString()}
                                </span>
                            </div>
                        </article>
                    ))}

                    {board.threads.length === 0 && (
                        <div className={styles.empty}>
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
                        value: "[BOARD_TOTAL]",
                    },
                    {
                        label: "Total threads",
                        value: "[THREAD_TOTAL]",
                    },
                ]}
                latestActivity={{
                    title: "[THREAD_NAME]",
                    user: "[LAST_USER_NAME]",
                    time: "[POST_TIME]",
                }}/>
        </div>
    );
}
