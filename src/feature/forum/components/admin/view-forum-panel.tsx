import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {UnassignedBoard} from "@/feature/forum/components/admin/unassigned-boards";
import {ForumBoard, ForumCategory, ViewCategoryContent,} from "@/feature/forum/components/admin/view-category-content";
import styles from "@/feature/forum/styles/admin.module.css";
import {JSX, useMemo} from "react";

type Props = {
    categories: ForumCategory[];
    unassignedBoards?: ForumBoard[];
    assignBoardCategoryAction?: (
        formData: FormData,
    ) => Promise<void>;
};

/**
 * Displays the complete forum hierarchy and any boards which have not
 * yet been assigned to a category.
 */
export function ViewForumPanel({
                                   categories,
                                   unassignedBoards = [],
                                   assignBoardCategoryAction,
                               }: Props): JSX.Element {
    const sortedCategories = useMemo(
        () => [...categories].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        ),
        [categories],
    );

    const sortedUnassignedBoards = useMemo(
        () => [...unassignedBoards].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        ),
        [unassignedBoards],
    );

    return (
        <div className={styles.forumViewer}>
            <MainContentPanel title={"View Forum"}>
                <div className={styles.forumTableContainer}>
                    <table className={styles.forumTable}>
                        <thead>
                        <tr>
                            <th className={styles.forumOrderColumn}>
                                Order
                            </th>

                            <th className={styles.forumNameColumn}>
                                Name
                            </th>

                            <th className={styles.forumDescriptionColumn}>
                                Description
                            </th>

                            <th className={styles.forumStatisticColumn}>
                                Total Threads
                            </th>

                            <th className={styles.forumStatisticColumn}>
                                Total Posts
                            </th>

                            <th className={styles.forumActionsColumn}>
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {sortedCategories.map((category) => (
                            <ViewCategoryContent key={category.id} category={category}/>
                        ))}

                        {sortedCategories.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.forumEmptyCell}>
                                    No forum categories have been
                                    created.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>

            <MainContentPanel title={"Unassigned Boards"}>
                <div className={styles.unassignedIntro}>
                    <p>
                        These boards currently do not belong to a forum
                        category. Assign them to a category or edit the board
                        directly.
                    </p>
                </div>

                {sortedUnassignedBoards.length > 0 ? (
                    <div className={styles.forumTableContainer}>
                        <table className={styles.unassignedTable}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th className={styles.forumStatisticColumn}>
                                    Total Threads
                                </th>
                                <th className={styles.assignColumn}>
                                    Assign Category
                                </th>
                                <th className={styles.forumActionsColumn}>
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {sortedUnassignedBoards.map((board) => (
                                <UnassignedBoard key={board.id}
                                                 board={board}
                                                 categories={sortedCategories}
                                                 assignCategoryAction={assignBoardCategoryAction}/>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.adminEmptyState}>
                        No unassigned boards.
                    </div>
                )}
            </MainContentPanel>
        </div>
    );
}
