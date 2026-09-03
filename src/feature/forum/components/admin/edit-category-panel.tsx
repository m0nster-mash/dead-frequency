"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {ForumCategory, ViewCategoryContent,} from "@/feature/forum/components/admin/view-category-content";
import styles from "@/feature/forum/styles/admin.module.css";
import Placeholder from "@/shared/components/placeholder";
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
        <div className={styles.categoryEditor}>
            <MainContentPanel title={"Edit Category"}>
                <div className={styles.adminField}>
                    <label className={styles.adminLabel} htmlFor="edit-category-select">
                        Category
                    </label>

                    <select id="edit-category-select"
                            className={styles.adminInput}
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
                    <div className={styles.adminEmptyState}>
                        Select a category to begin editing.
                    </div>
                </MainContentPanel>
            ) : (
                <>
                    <MainContentPanel title={"Category Information"}>
                        <form className={styles.adminForm}
                              action={updateCategoryAction}>
                            <input type="hidden"
                                   name="categoryId"
                                   value={selectedCategory.id}/>

                            <div className={styles.adminFormGrid}>
                                <div className={styles.adminField}>
                                    <label className={styles.adminLabel} htmlFor="edit-category-label">
                                        Label
                                    </label>

                                    <input id="edit-category-label"
                                           name="label"
                                           type="text"
                                           className={styles.adminInput}
                                           defaultValue={selectedCategory.label}
                                           required/>
                                </div>

                                <div className={styles.adminField}>
                                    <label className={styles.adminLabel}
                                           htmlFor="edit-category-sort-order">
                                        Sort Order
                                    </label>

                                    <input id="edit-category-sort-order"
                                           name="sortOrder"
                                           className={styles.adminInput}
                                           type="number"
                                           defaultValue={selectedCategory.sortOrder}
                                           required/>
                                </div>

                                <div className={styles.adminField}>
                                    <label className={styles.adminLabel}>
                                        Description
                                    </label>

                                    <Placeholder text={"CATEGORY_DESCRIPTION"}/>
                                </div>
                            </div>

                            <div className={styles.adminFormActions}>
                                <button type="submit"
                                        className={styles.adminPrimaryButton}>
                                    Update
                                </button>

                                <button type="submit"
                                        formAction={deleteCategoryAction}
                                        className={styles.adminDangerButton}>
                                    Delete
                                </button>
                            </div>
                        </form>
                    </MainContentPanel>

                    <MainContentPanel title={"Category Settings"}>
                        <div className={styles.adminPlaceholderGrid}>
                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Visibility
                                </span>

                                <Placeholder text={"CATEGORY_VISIBILITY"}/>
                            </div>

                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Permissions
                                </span>

                                <Placeholder text={"CATEGORY_PERMISSIONS"}/>
                            </div>

                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Posting Rules
                                </span>

                                <Placeholder text={"CATEGORY_POSTING_RULES"}/>
                            </div>

                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Moderation Settings
                                </span>

                                <Placeholder text={"CATEGORY_MODERATION"}/>
                            </div>
                        </div>
                    </MainContentPanel>

                    <MainContentPanel title={"View Category"}>
                        <div className={styles.forumTableWrapper}>
                            <table className={styles.forumTable}>
                                <thead>
                                <tr>
                                    <th className={styles.forumOrderColumn}>
                                        Order
                                    </th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th className={styles.forumStatisticColumn}>
                                        Total Threads
                                    </th>
                                    <th className={styles.forumStatisticColumn}>
                                        Total Posts
                                    </th>
                                    <th className={styles.forumStatisticColumn}>
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
                        <div className={styles.adminPlaceholderGrid}>
                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Total Threads
                                </span>

                                <Placeholder text={"CATEGORY_TOTAL_THREADS"}/>
                            </div>

                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
                                    Total Posts
                                </span>

                                <Placeholder text={"CATEGORY_TOTAL_POSTS"}/>
                            </div>

                            <div className={styles.adminPlaceholderField}>
                                <span className={styles.adminLabel}>
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
