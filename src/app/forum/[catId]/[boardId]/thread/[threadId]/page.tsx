import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import {replyToThreadAction} from "@/feature/forum/lib/actions";
import {getThreadWithPosts} from "@/feature/forum/lib/queries";

type PageProps = {
    params: Promise<{ catId: string; boardId: string; threadId: string }>;
};

export default async function ForumThreadPage({params}: PageProps) {
    const {catId, boardId, threadId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) redirect("/login");

    const data = await getThreadWithPosts(threadId);
    if (!data) notFound();
    if (data.thread.boardId !== boardId) notFound();

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={threadId} label={data.thread.title}/>
            <PageHeader
                eyebrow={"Forum"}
                title={data.thread.title}
                subtitle={`Started by ${data.thread.authorName || data.thread.authorEmail || "Unknown"}`}
            />

            <MainContentPanel title={"Reply"}>
                <form
                    className={styles.form}
                    action={async (formData) => {
                        "use server";
                        await replyToThreadAction({
                            threadId,
                            body: String(formData.get("body") || ""),
                            replyToUserId: String(formData.get("replyToUserId") || "") || undefined,
                        });
                    }}
                >
                    <div className={styles.field}>
                        <label className={styles.label}>Body</label>
                        <textarea name="body" className={styles.input} rows={6} required/>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Reply to user ID (optional)</label>
                        <input name="replyToUserId" className={styles.input}/>
                    </div>
                    <button type="submit" className={styles.submit}>Post Reply</button>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Posts"}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Author</th>
                            <th>Message</th>
                            <th>Posted</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.authorName || post.authorEmail || "—"}</td>
                                <td>{post.deletedAt ? <em>Deleted</em> : post.body}</td>
                                <td>{new Date(post.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {data.posts.length === 0 && (
                            <tr>
                                <td colSpan={3} className={styles.tableEmpty}>No posts in this thread yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}

