"use client";

import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import {ForumCategory, ViewCategoryContent,} from "@/_feature/forum/components/admin/view-category-content";
import adminStyles from "@/_feature/forum/styles/admin.module.css";
import Placeholder from "@/_shared/components/placeholder";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import formStyles from "@/_shared/styles/form.module.css";
import tableStyles from "@/_shared/styles/tables.module.css";
import {JSX, useMemo, useState} from "react";

type Props = {
    categories: ForumCategory[];
    updateCategoryAction: (formData: FormData) => Promise<void>;
    deleteCategoryAction: (formData: FormData) => Promise<void>;
};

/**
 * Category editing workspace.
 *
 * The category selector determines which category the smaller editor panels
 * operate on. Additional category controls can be added independently as
 * the underlying schema and requirements become clearer.
 */
export function EditCategoryPanel({
                                      categories,
                                      updateCategoryAction,
                                      deleteCategoryAction,
                                  }: Props): JSX.Element {
    const sortedCategories = useMemo(
        () =>
            [...categories].sort(
                (a, b) => a.sortOrder - b.sortOrder,
            ),
        [categories],
    );

    const [selectedCategoryId, setSelectedCategoryId] = useState(
        sortedCategories[0]?.id ?? "",
    );

    const selectedCategory = sortedCategories.find(
        (category) => category.id === selectedCategoryId,
    );

    return (
        <div className={adminStyles.categoryEditor}>
            <MainContentPanel title={"Edit Category"}>
                <div className={formStyles.formField}>
                    <label className={formStyles.formLabel} htmlFor="edit-category-select">
                        Category
                    </label>

                    <select id="edit-category-select"
                            className={formStyles.formInput}
                            value={selectedCategoryId}
                            onChange={(event) =>
                                setSelectedCategoryId(event.target.value)}>
                        <option value="">
                            Select a category...
                        </option>

                        {sortedCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </MainContentPanel>

            {!selectedCategory ? (
                <MainContentPanel title={"Category"}>
                    <div className={tableStyles.tableEmptyCell}>
                        Select a category to begin editing.
                    </div>
                </MainContentPanel>
            ) : (
                <>
                    <MainContentPanel title={"Category Information"}>
                        <form className={formStyles.form}
                              action={updateCategoryAction}>
                            <input type="hidden"
                                   name="categoryId"
                                   value={selectedCategory.id}/>

                            <div className={formStyles.formGrid}>
                                <div className={formStyles.formField}>
                                    <label className={formStyles.formLabel} htmlFor="edit-category-label">
                                        Label
                                    </label>

                                    <input id="edit-category-label"
                                           name="label"
                                           type="text"
                                           className={formStyles.formInput}
                                           defaultValue={selectedCategory.label}
                                           required/>
                                </div>

                                <div className={formStyles.formField}>
                                    <label className={formStyles.formLabel}
                                           htmlFor="edit-category-sort-order">
                                        Sort Order
                                    </label>

                                    <input id="edit-category-sort-order"
                                           name="sortOrder"
                                           className={formStyles.formInput}
                                           type="number"
                                           defaultValue={selectedCategory.sortOrder}
                                           required/>
                                </div>

                                <div className={formStyles.formField}>
                                    <label className={formStyles.formLabel}>
                                        Description
                                    </label>

                                    <Placeholder text={"CATEGORY_DESCRIPTION"}/>
                                </div>
                            </div>

                            <div className={formStyles.formActions}>
                                <button type="submit"
                                        className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                                    Update
                                </button>

                                <button type="submit"
                                        formAction={deleteCategoryAction}
                                        className={`${buttonStyles.btn} ${buttonStyles.btnDanger}`}>
                                    Delete
                                </button>
                            </div>
                        </form>
                    </MainContentPanel>

                    <MainContentPanel title={"Category Settings"}>
                        <div>
                            <div>
                                <span className={formStyles.formLabel}>
                                    Visibility
                                </span>

                                <Placeholder text={"CATEGORY_VISIBILITY"}/>
                            </div>

                            <div>
                                <span className={formStyles.formLabel}>
                                    Permissions
                                </span>

                                <Placeholder text={"CATEGORY_PERMISSIONS"}/>
                            </div>

                            <div>
                                <span className={formStyles.formLabel}>
                                    Posting Rules
                                </span>

                                <Placeholder text={"CATEGORY_POSTING_RULES"}/>
                            </div>

                            <div>
                                <span className={formStyles.formLabel}>
                                    Moderation Settings
                                </span>

                                <Placeholder text={"CATEGORY_MODERATION"}/>
                            </div>
                        </div>
                    </MainContentPanel>

                    <MainContentPanel title={"View Category"}>
                        <div className={tableStyles.tableWrapper}>
                            <table className={tableStyles.table}>
                                <thead>
                                <tr>
                                    <th className={adminStyles.forumOrderColumn}>
                                        Order
                                    </th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th className={adminStyles.forumStatisticColumn}>
                                        Total Threads
                                    </th>
                                    <th className={adminStyles.forumStatisticColumn}>
                                        Total Posts
                                    </th>
                                    <th className={adminStyles.forumStatisticColumn}>
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                <ViewCategoryContent category={selectedCategory} showCategoryRow={false}/>
                                </tbody>
                            </table>
                        </div>
                    </MainContentPanel>

                    <MainContentPanel title={"Category Statistics"}>
                        <div>
                            <div>
                                <span className={formStyles.formLabel}>
                                    Total Threads
                                </span>

                                <Placeholder text={"CATEGORY_TOTAL_THREADS"}/>
                            </div>

                            <div>
                                <span className={formStyles.formLabel}>
                                    Total Posts
                                </span>

                                <Placeholder text={"CATEGORY_TOTAL_POSTS"}/>
                            </div>

                            <div>
                                <span className={formStyles.formLabel}>
                                    Last Activity
                                </span>
                                <Placeholder text={"CATEGORY_LAST_ACTIVITY"}/>
                            </div>
                        </div>
                    </MainContentPanel>
                </>
            )}
        </div>
    );
}
