"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {ForumBoard, ForumCategory,} from "@/feature/forum/components/admin/view-category-content";
import adminStyles from "@/feature/forum/styles/admin.module.css";
import Placeholder from "@/shared/components/placeholder";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
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
        <div className={adminStyles.boardEditor}>
            <MainContentPanel title={"Edit Board"}>
                <form className={formStyles.form}
                      action={updateBoardAction}>
                    <input type="hidden"
                           name="boardId"
                           value={board.id}/>

                    <div className={formStyles.formGrid}>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel} htmlFor="edit-board-label">
                                Name
                            </label>

                            <input id="edit-board-label"
                                   name="label"
                                   type="text"
                                   className={formStyles.formInput}
                                   defaultValue={board.label}
                                   required/>
                        </div>

                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel} htmlFor="edit-board-description">
                                Description
                            </label>

                            <input id="edit-board-description"
                                   name="description"
                                   type="text"
                                   className={formStyles.formInput}
                                   defaultValue={board.description ?? ""}/>
                        </div>

                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel} htmlFor="edit-board-category">
                                Parent Category
                            </label>

                            <select id="edit-board-category"
                                    name="categoryId"
                                    className={formStyles.formInput}
                                    defaultValue={board.categoryId}>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}
                                   htmlFor="edit-board-sort-order">
                                Order
                            </label>

                            <input id="edit-board-sort-order"
                                   name="sortOrder"
                                   className={formStyles.formInput}
                                   type="number"
                                   defaultValue={board.sortOrder}
                                   required/>
                        </div>
                    </div>

                    <div className={adminStyles.adminFormActions}>
                        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                            Update
                        </button>
                    </div>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Board Stats"}>
                <div className={adminStyles.adminStatsGrid}>
                    <div className={adminStyles.adminStat}>
                        <span className={adminStyles.adminStatLabel}>
                            Total Threads
                        </span>

                        <Placeholder text={"BOARD_TOTAL_THREADS"}/>
                    </div>

                    <div className={adminStyles.adminStat}>
                        <span className={adminStyles.adminStatLabel}>
                            Total Posts
                        </span>

                        <Placeholder text={"BOARD_TOTAL_POSTS"}/>
                    </div>

                    <div className={adminStyles.adminStat}>
                        <span className={adminStyles.adminStatLabel}>
                            Last Activity
                        </span>

                        <Placeholder text={"BOARD_LAST_ACTIVITY"}/>
                    </div>

                    <div className={adminStyles.adminStat}>
                        <span className={adminStyles.adminStatLabel}>
                            Members
                        </span>

                        <Placeholder text={"BOARD_MEMBER_COUNT"}/>
                    </div>
                </div>
            </MainContentPanel>
        </div>
    );
}
