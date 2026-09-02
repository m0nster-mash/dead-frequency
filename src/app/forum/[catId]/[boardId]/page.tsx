import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import {getBoardWithThreads} from "@/feature/feature/forum/lib/queries";

type PageProps = {
    params: Promise<{ catId: string; boardId: string }>;
};

export default async function ForumBoardPage({params}: PageProps) {
    const {catId, boardId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) redirect("/login");

    const board = await getBoardWithThreads(boardId);
    if (!board || board.categoryId !== catId) notFound();

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={boardId} label={board.label}/>
            <PageHeader eyebrow={"Forum"} title={board.label} subtitle={board.description || "Threads in this board"}/>

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
                                    {/* thread detail route is a follow-up; posts render inline here for now */}
                                    {thread.title}
                                </td>
                                <td>{thread.authorName || thread.authorEmail || "—"}</td>
                                <td className={styles.tableNumeric}>{thread.postCount}</td>
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
