import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import styles from "@/shared/styles/form-panel.module.css";
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
            <PageHeader eyebrow={"Communication"}
                        title={"Forum"}
                        subtitle={"Browse categories and boards"}/>

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
