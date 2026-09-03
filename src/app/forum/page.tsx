import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import styles from "@shared/styles/forum.module.css";
import Link from "next/link";
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
            <PageHeader
                eyebrow="Communication"
                title="Forum"
                subtitle="Browse categories and boards"/>

            <div className={styles.categories}>
                {categories.map((category) => (
                    <MainContentPanel key={category.id}
                                      title={category.label}>
                        <div className={styles.boardList}>
                            {category.boards.map((board) => (
                                <article key={board.id}
                                         className={styles.board}>
                                    <div className={styles.boardMain}>
                                        <Link href={`/forum/${category.id}/${board.id}`}
                                              className={styles.boardName}>
                                            {board.label}
                                        </Link>

                                        <p className={styles.boardDescription}>
                                            {board.description || "—"}
                                        </p>
                                    </div>

                                    <div className={styles.boardActivity}>
                                        <div className={styles.latestThread}>
                                            <span className={styles.label}>
                                                Latest thread
                                            </span>

                                            <span className={styles.threadName}>
                                                [THREAD_NAME]
                                            </span>

                                            <span className={styles.threadAuthor}>
                                                by [AUTHOR_NAME]
                                            </span>
                                        </div>

                                        <div className={styles.boardStats}>
                                            <div className={styles.stat}>
                                                <span className={styles.statValue}>
                                                    [THREAD_TOTAL]
                                                </span>
                                                <span className={styles.statLabel}>
                                                    Threads
                                                </span>
                                            </div>

                                            <div className={styles.stat}>
                                                <span className={styles.statValue}>
                                                    [POST_TOTAL]
                                                </span>
                                                <span className={styles.statLabel}>
                                                    Posts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {category.boards.length === 0 && (
                                <div className={styles.empty}>
                                    No boards yet.
                                </div>
                            )}
                        </div>
                    </MainContentPanel>
                ))}

                {categories.length === 0 && (
                    <MainContentPanel title="No categories yet">
                        <p className={styles.empty}>
                            Check back soon.
                        </p>
                    </MainContentPanel>
                )}
            </div>

            <section className={styles.forumSummary}>
                <div className={styles.summaryHeader}>
                    <div>
                        <span className={styles.summaryEyebrow}>
                            Forum overview
                        </span>
                        <h2 className={styles.summaryTitle}>
                            Community activity
                        </h2>
                    </div>
                </div>

                <div className={styles.summaryGrid}>
                    <div className={styles.summaryStat}>
                        <span className={styles.summaryValue}>
                            [THREAD_TOTAL]
                        </span>
                        <span className={styles.summaryLabel}>
                            Total threads
                        </span>
                    </div>

                    <div className={styles.summaryStat}>
                        <span className={styles.summaryValue}>
                            [POST_TOTAL]
                        </span>
                        <span className={styles.summaryLabel}>
                            Total posts
                        </span>
                    </div>

                    <div className={styles.summaryRecent}>
                        <span className={styles.summaryLabel}>
                            Most recently active
                        </span>

                        <span className={styles.recentThread}>
                            [THREAD_NAME]
                        </span>

                        <span className={styles.recentMeta}>
                            Last post by [USER_NAME] · [POST_TIME]
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
