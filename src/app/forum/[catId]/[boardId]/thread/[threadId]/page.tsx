import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {CreateReplyPanel} from "@/feature/forum/components/create-reply-panel";
import {replyToThreadAction} from "@/feature/forum/lib/actions";
import {getThreadWithPosts} from "@/feature/forum/lib/queries";
import styles from "@/feature/forum/styles/forum.module.css";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import Placeholder from "@shared/components/placeholder";
import {notFound} from "next/navigation";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
/**
 * Properties for the ForumThreadPage component.
 *
 * @property {Promise<{ catId: string; boardId: string; threadId: string }>} params - A promise resolving to the
 * nested dynamic route parameters.
 */
type PageProps = {
    params: Promise<{
        catId: string;
        boardId: string;
        threadId: string;
    }>;
};

/**
 * A page that presents a forum thread discussion tree and an inline composition form.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ catId: string; boardId: string; threadId: string }>} props.params - Route parameters containing
 * the dynamic path hierarchy identifiers
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the unified forum thread and post management layout UI
 */
export default async function ForumThreadPage({params}: PageProps): Promise<JSX.Element> {
    const {catId, boardId, threadId} = await params;
    await requireSession();
    const data = await getThreadWithPosts(threadId);

    if (!data || data.thread.boardId !== boardId) {
        notFound();
    }

    const threadAuthor =
        data.thread.authorName ||
        data.thread.authorEmail ||
        "Unknown";

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={threadId}
                             label={data.thread.title}/>

            <PageHeader eyebrow="Forum"
                        title={data.thread.title}
                        subtitle={`Started by ${threadAuthor}`}/>

            <section className={styles.threadDiscussion}>
                {data.posts.map((post, index) => {
                    const author = post.authorName || post.authorEmail || "Unknown";

                    return (
                        <article key={post.id}
                                 className={styles.post}>
                            <aside className={styles.postSidebar}>
                                <div className={styles.avatarPlaceholder}>
                                    <Placeholder text={"avatar"}/>
                                </div>

                                <div className={styles.postAuthor}>
                                    {author}
                                </div>

                                <div className={styles.postRank}>
                                    <Placeholder text={"USER_RANK"}/>
                                </div>

                                <div className={styles.postStats}>
                                    <span>Posts: <Placeholder text={"POST_COUNT"}/></span>
                                    <span>Joined: <Placeholder text={"join_date"}/></span>
                                </div>
                            </aside>

                            <div className={styles.postContent}>
                                <header className={styles.postHeader}>
                                    <div className={styles.postHeaderMeta}>
                                        <span className={styles.postNumber}>
                                            #{index + 2}
                                        </span>

                                        <time className={styles.postDate}>
                                            {new Date(
                                                post.createdAt
                                            ).toLocaleString()}
                                        </time>
                                    </div>

                                    <div className={styles.postActions}>
                                        <button type="button"
                                                className={styles.postAction}>
                                            <Placeholder text={"quote"}/>
                                        </button>

                                        <button type="button"
                                                className={styles.postAction}>
                                            <Placeholder text={"report"}/>
                                        </button>
                                    </div>
                                </header>

                                <div className={styles.postBody}>
                                    {post.deletedAt ? (
                                        <em className={styles.deletedPost}>
                                            This post has been deleted.
                                        </em>
                                    ) : (
                                        post.body
                                    )}
                                </div>

                                <footer className={styles.postFooter}>
                                    <span><Placeholder text={"permalink"}/></span>
                                    <span><Placeholder text={"edit"}/></span>
                                </footer>
                            </div>
                        </article>
                    );
                })}

                {data.posts.length === 0 && (
                    <div className={styles.empty}>
                        No replies yet.
                    </div>
                )}
            </section>

            {/* Reply composer belongs after the discussion */}
            <CreateReplyPanel
                title="Post Reply"
                submitLabel="Post Reply"
                action={async (formData) => {
                    "use server";

                    await replyToThreadAction({
                        threadId,
                        body: String(formData.get("body") || ""),
                        replyToUserId:
                            String(
                                formData.get("replyToUserId") || ""
                            ) || undefined,
                    });
                }}
            />
        </div>
    );
}
