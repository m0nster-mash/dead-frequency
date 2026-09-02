import Link from "next/link";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";
import {getForumHierarchy} from "@/feature/feature/forum/lib/queries";

export default async function ForumIndexPage() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) redirect("/login");

    const categories = await getForumHierarchy();

    return (
        <div className={styles.wrapper}>
            <PageHeader eyebrow={"Communication"} title={"Forum"} subtitle={"Browse categories and boards"}/>

            {categories.map((category) => (
                <MainContentPanel key={category.id} title={category.label}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Board</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {category.boards.map((board) => (
                                <tr key={board.id}>
                                    <td>
                                        <Link href={`/forum/${category.id}/${board.id}`}>
                                            {board.label}
                                        </Link>
                                    </td>
                                    <td>{board.description || "—"}</td>
                                </tr>
                            ))}
                            {category.boards.length === 0 && (
                                <tr>
                                    <td colSpan={2} className={styles.tableEmpty}>No boards yet.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </MainContentPanel>
            ))}

            {categories.length === 0 && (
                <MainContentPanel title={"No categories yet"}>
                    <p className={styles.sectionSubtitle}>Check back soon.</p>
                </MainContentPanel>
            )}
        </div>
    );
}
