import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {getCategoryWithBoards} from "@/feature/forum/lib/queries";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import Link from "next/link";
import {notFound} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the ForumCategoryPage component.
 *
 * @property {Promise<{ catId: string }>} params - A promise resolving to the dynamic path parameters.
 */
type PageProps = {
    params: Promise<{ catId: string }>;
};

/**
 * A directory of discussion boards within a specific forum category.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ catId: string }>} props.params - Route parameter promise containing the category unique identifier
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the sub-forum board registry directory layout
 */
export default async function ForumCategoryPage({params}: PageProps): Promise<JSX.Element> {
    await requireSession();
    const {catId} = await params;
    const category = await getCategoryWithBoards(catId);

    // throw a 404 response layout if the target category record cannot be located
    if (!category) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={catId}
                             label={category.label}/>

            <PageHeader eyebrow={"Forum"}
                        title={category.label}
                        subtitle={"Boards in this category"}/>

            <MainContentPanel title={"Boards"}>
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
                                <td colSpan={2} className={styles.tableEmpty}>No boards in this category yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
