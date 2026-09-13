"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import formStyles from "@/shared/styles/form.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import tableStyles from "@/shared/styles/tables.module.css";
import {JSX, useMemo} from "react";

/**
 * Structural definition of a forum board configuration record.
 *
 * TODO:: this panel is not currently in use anywhere. If it's no longer needed, delete it.
 *
 * @property {string} id - Unique identifier for the board.
 * @property {string} categoryId - Parent category reference identifier.
 * @property {string} label - Display name of the discussion board.
 * @property {string | null} description - Secondary sub-text explaining board scope.
 * @property {number} sortOrder - Numeric index specifying render weights.
 * @property {string | null} contextId - Associated system or scenario runtime context.
 * @property {boolean} allowsCharacterPosting - Configuration permitting profile alias deployment.
 */
type Board = {
    id: string;
    categoryId: string;
    label: string;
    description: string | null;
    sortOrder: number;
    contextId: string | null;
    allowsCharacterPosting: boolean;
};

/**
 * Structural nesting grouping containing child configuration arrays.
 *
 * @property {string} id - Unique identifier for the category.
 * @property {string} label - Section header text.
 * @property {number} sortOrder - Numeric sorting index.
 * @property {Board[]} boards - Array list containing corresponding child boards.
 */
type Category = {
    id: string;
    label: string;
    sortOrder: number;
    boards: Board[];
};

/**
 * Properties for the AdminForumManagementPanel component.
 *
 * @property {Category[]} categories - Unsorted raw collection arrays pulled from server endpoints.
 * @property {(formData: FormData) => Promise<void>} createCategoryAction - Appends a category entry.
 * @property {(formData: FormData) => Promise<void>} updateCategoryAction - Modifies category data fields.
 * @property {(formData: FormData) => Promise<void>} deleteCategoryAction - Destroys a category container.
 * @property {(formData: FormData) => Promise<void>} reorderCategoriesAction - Saves global category sequences.
 * @property {(formData: FormData) => Promise<void>} createBoardAction - Appends a board into a target category.
 * @property {(formData: FormData) => Promise<void>} updateBoardAction - Alter board text fields and order rules.
 * @property {(formData: FormData) => Promise<void>} deleteBoardAction - Purges board rows from storage.
 * @property {(formData: FormData) => Promise<void>} moveBoardAction - Reassigns parent relationships.
 * @property {(formData: FormData) => Promise<void>} reorderBoardsAction - Dictates inline order parameters.
 * @property {(formData: FormData) => Promise<void>} removeBoardFromCategoryAction - Soft-detaches category relations.
 */
type Props = {
    categories: Category[];
    createCategoryAction: (formData: FormData) => Promise<void>;
    updateCategoryAction: (formData: FormData) => Promise<void>;
    deleteCategoryAction: (formData: FormData) => Promise<void>;
    reorderCategoriesAction: (formData: FormData) => Promise<void>;
    createBoardAction: (formData: FormData) => Promise<void>;
    updateBoardAction: (formData: FormData) => Promise<void>;
    deleteBoardAction: (formData: FormData) => Promise<void>;
    moveBoardAction: (formData: FormData) => Promise<void>;
    reorderBoardsAction: (formData: FormData) => Promise<void>;
    removeBoardFromCategoryAction: (formData: FormData) => Promise<void>;
};

/**
 * Provides complete CRUD administration configurations for forum trees. Renders multiple compact isolated forms
 * wired directly to native Next.js Server Actions.
 *
 * @param {Props} props - The component properties.
 *
 * @returns {JSX.Element} The visual schema management tool interface grid.
 */
export function AdminForumManagementPanel(props: Props): JSX.Element {
    // computes client-side sorting tracking variations safely without causing structural mutation state drops
    const allCategories = useMemo(
        () => [...props.categories].sort((a, b) => a.sortOrder - b.sortOrder),
        [props.categories],
    );

    return (
        <>
            <MainContentPanel title={"Create Category"}>
                <form className={formStyles.form} action={props.createCategoryAction}>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Label</label>
                        <input name="label" className={formStyles.formInput} required/>
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Sort Order</label>
                        <input name="sortOrder" className={formStyles.formInput} type="number" defaultValue={0} required/>
                    </div>
                    <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Add Category</button>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Reorder Categories"}>
                <form className={formStyles.form} action={props.reorderCategoriesAction}>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Category IDs in order (comma-separated)</label>
                        <input name="orderedCategoryIds" className={formStyles.formInput} placeholder="cat-id-1,cat-id-2"
                               required/>
                    </div>
                    <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Apply Category Order</button>
                </form>
            </MainContentPanel>

            {allCategories.map((category) => (
                <MainContentPanel key={category.id} title={`Category: ${category.label}`}>
                    <form className={formStyles.form} action={props.updateCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Label</label>
                            <input name="label" className={formStyles.formInput} defaultValue={category.label} required/>
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Sort Order</label>
                            <input name="sortOrder" className={formStyles.formInput} type="number"
                                   defaultValue={category.sortOrder} required/>
                        </div>
                        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Update Category</button>
                    </form>

                    <form className={formStyles.form} action={props.deleteCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Delete Category</button>
                    </form>

                    <hr/>

                    <h4 className={panelStyles.panelHeaderTitle}>Create Board in this Category</h4>
                    <form className={formStyles.form} action={props.createBoardAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Label</label>
                            <input name="label" className={formStyles.formInput} required/>
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Description</label>
                            <input name="description" className={formStyles.formInput}/>
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Sort Order</label>
                            <input name="sortOrder" className={formStyles.formInput} type="number" defaultValue={0} required/>
                        </div>
                        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Add Board</button>
                    </form>

                    <h4 className={panelStyles.panelHeaderTitle}>Reorder Boards in this Category</h4>
                    <form className={formStyles.form} action={props.reorderBoardsAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Board IDs in order (comma-separated)</label>
                            <input name="orderedBoardIds" className={formStyles.formInput} placeholder="board-id-1,board-id-2"
                                   required/>
                        </div>
                        <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Apply Board Order</button>
                    </form>

                    <div className={tableStyles.tableWrapper}>
                        <table className={tableStyles.table}>
                            <thead>
                            <tr>
                                <th>Label</th>
                                <th>Description</th>
                                <th>Sort</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {category.boards.map((board) => (
                                <tr key={board.id}>
                                    <td>{board.label}</td>
                                    <td>{board.description || "—"}</td>
                                    <td>{board.sortOrder}</td>
                                    <td>
                                        <form className={formStyles.form} action={props.updateBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <input type="hidden" name="categoryId" value={category.id}/>
                                            <input name="label" className={formStyles.formInput} defaultValue={board.label}
                                                   required/>
                                            <input name="description" className={formStyles.formInput}
                                                   defaultValue={board.description ?? ""}/>
                                            <input name="sortOrder" className={formStyles.formInput} type="number"
                                                   defaultValue={board.sortOrder} required/>
                                            <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Update</button>
                                        </form>

                                        <form className={formStyles.form} action={props.deleteBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Delete</button>
                                        </form>

                                        <form className={formStyles.form} action={props.removeBoardFromCategoryAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Remove from Category
                                            </button>
                                        </form>

                                        <form className={formStyles.form} action={props.moveBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <select name="targetCategoryId" className={formStyles.formInput}
                                                    defaultValue={category.id}>
                                                {allCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                            <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Move Board</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {category.boards.length === 0 && (
                                <tr>
                                    <td colSpan={4} className={tableStyles.tableEmptyCell}>No boards in this category.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </MainContentPanel>
            ))}
        </>
    );
}
