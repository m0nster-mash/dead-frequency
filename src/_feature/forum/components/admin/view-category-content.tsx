import adminStyles from "@/_feature/forum/styles/admin.module.css";
import Placeholder from "@/_shared/components/placeholder";
import tableStyles from "@/_shared/styles/tables.module.css";
import Link from "next/link";
import {JSX} from "react";

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
                <tr className={adminStyles.forumCategoryRow}>
                    <td className={adminStyles.forumOrderCell}>
                        <Placeholder text={"CATEGORY_ORDER"}/>
                    </td>

                    <td>
                        <div className={adminStyles.forumCategoryName}>
                            {category.label}
                        </div>
                    </td>

                    <td>
                        <div className={adminStyles.forumCategoryDescription}>
                            {category.description || (
                                <Placeholder text={"CATEGORY_DESCRIPTION"}/>
                            )}
                        </div>
                    </td>

                    <td className={adminStyles.forumStatisticCell}>
                        <Placeholder text={"CATEGORY_TOTAL_THREADS"}/>
                    </td>

                    <td className={adminStyles.forumStatisticCell}>
                        <Placeholder text={"CATEGORY_TOTAL_POSTS"}/>
                    </td>

                    <td className={adminStyles.forumActionCell}>
                        <Link href={`/admin/forum/${category.id}`}
                              className={adminStyles.forumEditButton}>
                            Edit
                        </Link>
                    </td>
                </tr>
            )}

            {boards.map((board) => (
                <tr key={board.id} className={adminStyles.forumBoardRow}>
                    <td className={adminStyles.forumOrderCell}>
                        <Placeholder text={"BOARD_ORDER"}/>
                    </td>

                    <td>
                        <div className={adminStyles.forumBoardName}>
                            {board.label}
                        </div>
                    </td>

                    <td>
                        <div className={adminStyles.forumBoardDescription}>
                            {board.description || "—"}
                        </div>
                    </td>

                    <td className={adminStyles.forumStatisticCell}>
                        <Placeholder text={"BOARD_TOTAL_THREADS"}/>
                    </td>

                    <td className={adminStyles.forumStatisticCell}>
                        <Placeholder text={"BOARD_TOTAL_POSTS"}/>
                    </td>

                    <td className={adminStyles.forumActionCell}>
                        <Link href={`/admin/forum/boards/${board.id}`}
                              className={adminStyles.forumEditButton}>
                            Edit
                        </Link>
                    </td>
                </tr>
            ))}

            {boards.length === 0 && showCategoryRow && (
                <tr className={adminStyles.forumBoardRow}>
                    <td colSpan={6} className={tableStyles.tableEmptyCell}>
                        No boards in this category.
                    </td>
                </tr>
            )}
        </>
    );
}
