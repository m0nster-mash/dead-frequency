"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/shared/styles/form-panel.module.css";
import {JSX, useMemo} from "react";

/**
 * Structural definition of a forum board configuration record.
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
                <form className={styles.form} action={props.createCategoryAction}>
                    <div className={styles.field}>
                        <label className={styles.label}>Label</label>
                        <input name="label" className={styles.input} required/>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Sort Order</label>
                        <input name="sortOrder" className={styles.input} type="number" defaultValue={0} required/>
                    </div>
                    <button type="submit" className={styles.submit}>Add Category</button>
                </form>
            </MainContentPanel>

            <MainContentPanel title={"Reorder Categories"}>
                <form className={styles.form} action={props.reorderCategoriesAction}>
                    <div className={styles.field}>
                        <label className={styles.label}>Category IDs in order (comma-separated)</label>
                        <input name="orderedCategoryIds" className={styles.input} placeholder="cat-id-1,cat-id-2"
                               required/>
                    </div>
                    <button type="submit" className={styles.submit}>Apply Category Order</button>
                </form>
            </MainContentPanel>

            {allCategories.map((category) => (
                <MainContentPanel key={category.id} title={`Category: ${category.label}`}>
                    <form className={styles.form} action={props.updateCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={styles.field}>
                            <label className={styles.label}>Label</label>
                            <input name="label" className={styles.input} defaultValue={category.label} required/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Sort Order</label>
                            <input name="sortOrder" className={styles.input} type="number"
                                   defaultValue={category.sortOrder} required/>
                        </div>
                        <button type="submit" className={styles.submit}>Update Category</button>
                    </form>

                    <form className={styles.form} action={props.deleteCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <button type="submit" className={styles.submit}>Delete Category</button>
                    </form>

                    <hr/>

                    <h4 className={styles.sectionTitle}>Create Board in this Category</h4>
                    <form className={styles.form} action={props.createBoardAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={styles.field}>
                            <label className={styles.label}>Label</label>
                            <input name="label" className={styles.input} required/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <input name="description" className={styles.input}/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Sort Order</label>
                            <input name="sortOrder" className={styles.input} type="number" defaultValue={0} required/>
                        </div>
                        <button type="submit" className={styles.submit}>Add Board</button>
                    </form>

                    <h4 className={styles.sectionTitle}>Reorder Boards in this Category</h4>
                    <form className={styles.form} action={props.reorderBoardsAction}>
                        <input type="hidden" name="categoryId" value={category.id}/>
                        <div className={styles.field}>
                            <label className={styles.label}>Board IDs in order (comma-separated)</label>
                            <input name="orderedBoardIds" className={styles.input} placeholder="board-id-1,board-id-2"
                                   required/>
                        </div>
                        <button type="submit" className={styles.submit}>Apply Board Order</button>
                    </form>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
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
                                        <form className={styles.form} action={props.updateBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <input type="hidden" name="categoryId" value={category.id}/>
                                            <input name="label" className={styles.input} defaultValue={board.label}
                                                   required/>
                                            <input name="description" className={styles.input}
                                                   defaultValue={board.description ?? ""}/>
                                            <input name="sortOrder" className={styles.input} type="number"
                                                   defaultValue={board.sortOrder} required/>
                                            <button type="submit" className={styles.submit}>Update</button>
                                        </form>

                                        <form className={styles.form} action={props.deleteBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <button type="submit" className={styles.submit}>Delete</button>
                                        </form>

                                        <form className={styles.form} action={props.removeBoardFromCategoryAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <button type="submit" className={styles.submit}>Remove from Category
                                            </button>
                                        </form>

                                        <form className={styles.form} action={props.moveBoardAction}>
                                            <input type="hidden" name="boardId" value={board.id}/>
                                            <select name="targetCategoryId" className={styles.input}
                                                    defaultValue={category.id}>
                                                {allCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                            <button type="submit" className={styles.submit}>Move Board</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {category.boards.length === 0 && (
                                <tr>
                                    <td colSpan={4} className={styles.tableEmpty}>No boards in this category.</td>
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
