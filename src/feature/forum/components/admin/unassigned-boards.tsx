import {ForumBoard, ForumCategory} from "@/feature/forum/components/admin/view-category-content";
import styles from "@/feature/forum/styles/admin.module.css";
import Placeholder from "@/shared/components/placeholder";
import Link from "next/link";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
type Props = {
    board: ForumBoard;
    categories: ForumCategory[];
    assignCategoryAction?: (formData: FormData) => Promise<void>;
};

/**
 * Displays a forum board which currently has no parent category.
 */
export function UnassignedBoard({board, categories, assignCategoryAction}: Props): JSX.Element {
    return (
        <tr className={styles.unassignedBoardRow}>
            <td>
                <div className={styles.unassignedBoardName}>
                    {board.label}
                </div>
            </td>

            <td>
                <div className={styles.unassignedBoardDescription}>
                    {board.description || "—"}
                </div>
            </td>

            <td className={styles.forumStatisticCell}>
                <Placeholder text={"BOARD_TOTAL_THREADS"}/>
            </td>

            <td>
                {assignCategoryAction ? (
                    <form action={assignCategoryAction}
                          className={styles.assignCategoryForm}>
                        <input type="hidden"
                               name="boardId"
                               value={board.id}/>

                        <select name="categoryId"
                                className={styles.adminInput}
                                defaultValue=""
                                required>
                            <option value="" disabled>
                                Select category...
                            </option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className={styles.adminPrimaryButton}>
                            Assign
                        </button>
                    </form>
                ) : (
                    <Placeholder text={"ASSIGN_CATEGORY_ACTION"}/>
                )}
            </td>

            <td className={styles.forumActionCell}>
                <Link href={`/admin/forum/boards/${board.id}`} className={styles.forumEditButton}>
                    Edit
                </Link>
            </td>
        </tr>
    );
}
