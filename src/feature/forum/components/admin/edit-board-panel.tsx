"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {ForumBoard, ForumCategory,} from "@/feature/forum/components/admin/view-category-content";
import styles from "@/feature/forum/styles/admin.module.css";
import Placeholder from "@/shared/components/placeholder";
import {JSX} from "react";

type Props = {
    board: ForumBoard;
    categories: ForumCategory[];
    updateBoardAction: (formData: FormData) => Promise<void>;
};

/**
 * Provides the administration interface for editing a forum board.
 */
export function EditBoardPanel({board, categories, updateBoardAction,}: Props): JSX.Element {

    return (
        <div className={styles.boardEditor}>
            <MainContentPanel title={"Edit Board"}>
                <form className={styles.adminForm}
                      action={updateBoardAction}>
                    <input type="hidden"
                           name="boardId"
                           value={board.id}/>

                    <div className={styles.adminFormGrid}>
                        <div className={styles.adminField}>
                            <label className={styles.adminLabel} htmlFor="edit-board-label">
                                Name
                            </label>

                            <input id="edit-board-label"
                                   name="label"
                                   type="text"
                                   className={styles.adminInput}
                                   defaultValue={board.label}
                                   required/>
                        </div>

                        <div className={styles.adminField}>
                            <label className={styles.adminLabel} htmlFor="edit-board-description">
                                Description
                            </label>

                            <input id="edit-board-description"
                                   name="description"
                                   type="text"
                                   className={styles.adminInput}
                                   defaultValue={board.description ?? ""}/>
                        </div>

                        <div className={styles.adminField}>
                            <label className={styles.adminLabel} htmlFor="edit-board-category">
                                Parent Category
                            </label>

                            <select id="edit-board-category"
                                    name="categoryId"
                                    className={styles.adminInput}
                                    defaultValue={board.categoryId}>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.adminField}>
                            <label className={styles.adminLabel}
                                   htmlFor="edit-board-sort-order">
                                Order
                            </label>

                            <input id="edit-board-sort-order"
                                   name="sortOrder"
                                   className={styles.adminInput}
                                   type="number"
                                   defaultValue={board.sortOrder}
                                   required/>
                        </div>
                    </div>

                    <div className={styles.adminFormActions}>
                        <button type="submit" className={styles.adminPrimaryButton}>
                            Update
                        </button>
                    </div>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Board Stats"}>
                <div className={styles.adminStatsGrid}>
                    <div className={styles.adminStat}>
                        <span className={styles.adminStatLabel}>
                            Total Threads
                        </span>

                        <Placeholder text={"BOARD_TOTAL_THREADS"}/>
                    </div>

                    <div className={styles.adminStat}>
                        <span className={styles.adminStatLabel}>
                            Total Posts
                        </span>

                        <Placeholder text={"BOARD_TOTAL_POSTS"}/>
                    </div>

                    <div className={styles.adminStat}>
                        <span className={styles.adminStatLabel}>
                            Last Activity
                        </span>

                        <Placeholder text={"BOARD_LAST_ACTIVITY"}/>
                    </div>

                    <div className={styles.adminStat}>
                        <span className={styles.adminStatLabel}>
                            Members
                        </span>

                        <Placeholder text={"BOARD_MEMBER_COUNT"}/>
                    </div>
                </div>
            </MainContentPanel>
        </div>
    );
}
