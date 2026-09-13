// "use client";
//
// import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
// import {ForumCategory} from "@/feature/forum/components/admin/view-category-content";
// import adminStyles from "@/feature/forum/styles/admin.module.css";
// import buttonStyles from "@/shared/styles/buttons.module.css";
// import formStyles from "@/shared/styles/form.module.css";
// import {JSX} from "react";
//
// type Props = {
//     /**
//      * Server action to handle board creation.
//      * Receives FormData with: label, description (optional), categoryId (optional), sortOrder
//      */
//     createBoardAction: (formData: FormData) => Promise<void>;
//
//     /**
//      * Array of available categories. If provided and non-empty, the category selector becomes optional.
//      * If empty or undefined, the board is created as standalone (no parent category).
//      */
//     categories?: ForumCategory[];
//
//     /**
//      * Optional parent category ID to pre-select in the category selector.
//      * Only used if categories are provided.
//      */
//     defaultCategoryId?: string;
// };
//
// /**
//  * Reusable admin panel for creating forum boards.
//  *
//  * Supports two modes of operation:
//  * 1. Standalone board creation: When categories prop is undefined or empty, creates a board with no parent category.
//  * 2. Category-linked board creation: When categories are provided, requires selecting a parent category.
//  *
//  * @param {Props} props - Component configuration
//  * @returns {JSX.Element} The create board panel UI
//  */
// export function CreateBoardPanel({
//                                      createBoardAction,
//                                      categories,
//                                      defaultCategoryId,
//                                  }: Props): JSX.Element {
//     const hasCategories = categories && categories.length > 0;
//
//     return (
//         <div className={adminStyles.boardEditor}>
//             <MainContentPanel title={"Create Board"}>
//                 <form className={formStyles.form}
//                       action={createBoardAction}>
//
//                     <div className={formStyles.formGrid}>
//                         <div className={formStyles.formField}>
//                             <label className={formStyles.formLabel} htmlFor="create-board-label">
//                                 Name
//                             </label>
//
//                             <input id="create-board-label"
//                                    name="label"
//                                    type="text"
//                                    className={formStyles.formInput}
//                                    placeholder="Board name"
//                                    required/>
//                         </div>
//
//                         <div className={formStyles.formField}>
//                             <label className={formStyles.formLabel} htmlFor="create-board-description">
//                                 Description
//                             </label>
//
//                             <input id="create-board-description"
//                                    name="description"
//                                    type="text"
//                                    className={formStyles.formInput}
//                                    placeholder="Brief description (optional)"/>
//                         </div>
//
//                         {hasCategories && (
//                             <div className={formStyles.formField}>
//                                 <label className={formStyles.formLabel} htmlFor="create-board-category">
//                                     Parent Category
//                                 </label>
//
//                                 <select id="create-board-category"
//                                         name="categoryId"
//                                         className={formStyles.formInput}
//                                         defaultValue={defaultCategoryId ?? ""}
//                                         required>
//                                     <option value="" disabled>
//                                         Select a category...
//                                     </option>
//                                     {categories.map((category) => (
//                                         <option key={category.id} value={category.id}>
//                                             {category.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}
//
//                         {!hasCategories && (
//                             <input type="hidden"
//                                    name="categoryId"
//                                    value=""/>
//                         )}
//
//                         <div className={formStyles.formField}>
//                             <label className={formStyles.formLabel}
//                                    htmlFor="create-board-sort-order">
//                                 Order
//                             </label>
//
//                             <input id="create-board-sort-order"
//                                    name="sortOrder"
//                                    className={formStyles.formInput}
//                                    type="number"
//                                    defaultValue="0"
//                                    required/>
//                         </div>
//                     </div>
//
//                     <div className={adminStyles.adminFormActions}>
//                         <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
//                             Create Board
//                         </button>
//                     </div>
//                 </form>
//             </MainContentPanel>
//         </div>
//     );
// }
