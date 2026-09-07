"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import adminStyles from "@/feature/forum/styles/admin.module.css";
import {JSX} from "react";

/**
 * TODO:: clean up styles
 */
type Props = {
    createCategoryAction: (formData: FormData) => Promise<void>;
};

/**
 * Creates a new forum category.
 */
export function CreateCategoryPanel({createCategoryAction,}: Props): JSX.Element {
    return (
        <MainContentPanel title={"Create Category"}>
            <form className={adminStyles.adminForm}
                  action={createCategoryAction}>
                <div className={adminStyles.adminFormGrid}>
                    <div className={adminStyles.adminField}>
                        <label className={adminStyles.adminLabel} htmlFor="create-category-label">
                            Label
                        </label>

                        <input id="create-category-label"
                               name="label"
                               type="text"
                               className={adminStyles.adminInput}
                               required/>
                    </div>

                    <div className={adminStyles.adminField}>
                        <label className={adminStyles.adminLabel} htmlFor="create-category-label">
                            Description
                        </label>

                        <input id="create-category-label"
                               name="description"
                               type="text"
                               className={adminStyles.adminInput}
                               required/>
                    </div>

                    <div className={adminStyles.adminField}>
                        <label className={adminStyles.adminLabel} htmlFor="create-category-sort-order">
                            Order
                        </label>

                        <input id="create-category-sort-order"
                               name="sortOrder"
                               className={adminStyles.adminInput}
                               type="number"
                               defaultValue={0}
                               required/>
                    </div>
                </div>

                <div className={adminStyles.adminFormActions}>
                    <button type="submit" className={adminStyles.adminPrimaryButton}>
                        Create
                    </button>
                </div>
            </form>
        </MainContentPanel>
    );
}
