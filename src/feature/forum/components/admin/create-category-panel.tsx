"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/feature/forum/styles/admin.module.css";
import {JSX} from "react";

type Props = {
    createCategoryAction: (formData: FormData) => Promise<void>;
};

/**
 * Creates a new forum category.
 */
export function CreateCategoryPanel({createCategoryAction,}: Props): JSX.Element {
    return (
        <MainContentPanel title={"Create Category"}>
            <form className={styles.adminForm}
                  action={createCategoryAction}>
                <div className={styles.adminFormGrid}>
                    <div className={styles.adminField}>
                        <label className={styles.adminLabel} htmlFor="create-category-label">
                            Label
                        </label>

                        <input id="create-category-label"
                               name="label"
                               type="text"
                               className={styles.adminInput}
                               required/>
                    </div>

                    <div className={styles.adminField}>
                        <label className={styles.adminLabel} htmlFor="create-category-label">
                            Description
                        </label>

                        <input id="create-category-label"
                               name="description"
                               type="text"
                               className={styles.adminInput}
                               required/>
                    </div>

                    <div className={styles.adminField}>
                        <label className={styles.adminLabel} htmlFor="create-category-sort-order">
                            Order
                        </label>

                        <input id="create-category-sort-order"
                               name="sortOrder"
                               className={styles.adminInput}
                               type="number"
                               defaultValue={0}
                               required/>
                    </div>
                </div>

                <div className={styles.adminFormActions}>
                    <button type="submit" className={styles.adminPrimaryButton}>
                        Create
                    </button>
                </div>
            </form>
        </MainContentPanel>
    );
}
