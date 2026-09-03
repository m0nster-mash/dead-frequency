import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {createThreadAction} from "@/feature/forum/lib/actions";
import {getBoardWithThreads} from "@/feature/forum/lib/queries";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import {headers} from "next/headers";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the ForumBoardPage component.
 *
 * @property {Promise<{ catId: string; boardId: string }>} params - A promise resolving to the dynamic path parameters.
 */
type PageProps = {
    params: Promise<{
        catId: string;
        boardId: string
    }>;
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
    const {catId, boardId} = await params;
    const requestHeaders = await headers();

    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) {
        redirect("/login");
    }

    const board = await getBoardWithThreads(boardId);

    // verify the board exists and securely falls within the specified category route parameter context
    if (!board || board.categoryId !== catId) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={boardId}
                             label={board.label}/>

            <PageHeader eyebrow={"Forum"}
                        title={board.label}
                        subtitle={board.description || "Threads in this board"}/>

            <MainContentPanel title={"Create Thread"}>
                <form
                    className={styles.form}
                    action={async (formData) => {
                        "use server";
                        await createThreadAction({
                            boardId,
                            title: String(formData.get("title") || ""),
                            body: String(formData.get("body") || ""),
                        });
                    }}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <input name="title" className={styles.input} required/>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Body</label>
                        <textarea name="body" className={styles.input} rows={6} required/>
                    </div>
                    <button type="submit" className={styles.submit}>Post Thread</button>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Threads"}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Replies</th>
                            <th>Last activity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {board.threads.map((thread) => (
                            <tr key={thread.id}>
                                <td>
                                    {thread.pinned && <span className={styles.badge}>Pinned</span>}{" "}
                                    <Link href={`/forum/${catId}/${boardId}/thread/${thread.id}`}>{thread.title}</Link>
                                </td>
                                <td>{thread.authorName || thread.authorEmail || "—"}</td>
                                <td className={styles.tableNumeric}>{Math.max(0, thread.postCount - 1)}</td>
                                <td>{new Date(thread.lastPostAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {board.threads.length === 0 && (
                            <tr>
                                <td colSpan={4} className={styles.tableEmpty}>No threads yet. Be the first to post.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
