import styles from "@/feature/forum/styles/admin.module.css";
import Placeholder from "@/shared/components/placeholder";
import Link from "next/link";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
export type ForumBoard = {
    id: string;
    categoryId: string;
    label: string;
    description: string | null;
    sortOrder: number;
    contextId: string | null;
    allowsCharacterPosting: boolean;
};

export type ForumCategory = {
    id: string;
    label: string;
    description?: string | null;
    sortOrder: number;
    boards: ForumBoard[];
};

type Props = {
    category: ForumCategory;
    showCategoryRow?: boolean;
};

/**
 * Read-only representation of one forum category and its boards.
 *
 * Used by both ViewForumPanel and the category editor.
 */
export function ViewCategoryContent({
                                        category,
                                        showCategoryRow = true,
                                    }: Props): JSX.Element {
    const boards = [...category.boards].sort(
        (a, b) => a.sortOrder - b.sortOrder,
    );

    return (
        <>
            {showCategoryRow && (
                <tr className={styles.forumCategoryRow}>
                    <td className={styles.forumOrderCell}>
                        <Placeholder text={"CATEGORY_ORDER"}/>
                    </td>

                    <td>
                        <div className={styles.forumCategoryName}>
                            {category.label}
                        </div>
                    </td>

                    <td>
                        <div className={styles.forumCategoryDescription}>
                            {category.description || (
                                <Placeholder text={"CATEGORY_DESCRIPTION"}/>
                            )}
                        </div>
                    </td>

                    <td className={styles.forumStatisticCell}>
                        <Placeholder text={"CATEGORY_TOTAL_THREADS"}/>
                    </td>

                    <td className={styles.forumStatisticCell}>
                        <Placeholder text={"CATEGORY_TOTAL_POSTS"}/>
                    </td>

                    <td className={styles.forumActionCell}>
                        <Link href={`/admin/forum/${category.id}`}
                              className={styles.forumEditButton}>
                            Edit
                        </Link>
                    </td>
                </tr>
            )}

            {boards.map((board) => (
                <tr key={board.id} className={styles.forumBoardRow}>
                    <td className={styles.forumOrderCell}>
                        <Placeholder text={"BOARD_ORDER"}/>
                    </td>

                    <td>
                        <div className={styles.forumBoardName}>
                            {board.label}
                        </div>
                    </td>

                    <td>
                        <div className={styles.forumBoardDescription}>
                            {board.description || "—"}
                        </div>
                    </td>

                    <td className={styles.forumStatisticCell}>
                        <Placeholder text={"BOARD_TOTAL_THREADS"}/>
                    </td>

                    <td className={styles.forumStatisticCell}>
                        <Placeholder text={"BOARD_TOTAL_POSTS"}/>
                    </td>

                    <td className={styles.forumActionCell}>
                        <Link href={`/admin/forum/boards/${board.id}`}
                              className={styles.forumEditButton}>
                            Edit
                        </Link>
                    </td>
                </tr>
            ))}

            {boards.length === 0 && showCategoryRow && (
                <tr className={styles.forumBoardRow}>
                    <td colSpan={6} className={styles.forumEmptyCell}>
                        No boards in this category.
                    </td>
                </tr>
            )}
        </>
    );
}
