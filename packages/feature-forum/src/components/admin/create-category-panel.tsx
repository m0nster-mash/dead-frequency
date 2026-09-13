// "use client";
//
// import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
// import buttonStyles from "@/shared/styles/buttons.module.css";
// import formStyles from "@/shared/styles/form.module.css";
// import {JSX} from "react";
//
// type Props = {
//     createCategoryAction: (formData: FormData) => Promise<void>;
// };
//
// /**
//  * Creates a new forum category.
//  */
// export function CreateCategoryPanel({createCategoryAction,}: Props): JSX.Element {
//     return (
//         <MainContentPanel title={"Create Category"}>
//             <form className={formStyles.form}
//                   action={createCategoryAction}>
//                 <div className={formStyles.formGrid}>
//                     <div className={formStyles.formField}>
//                         <label className={formStyles.formLabel} htmlFor="create-category-label">
//                             Label
//                         </label>
//
//                         <input id="create-category-label"
//                                name="label"
//                                type="text"
//                                className={formStyles.formInput}
//                                required/>
//                     </div>
//
//                     <div className={formStyles.formField}>
//                         <label className={formStyles.formLabel} htmlFor="create-category-label">
//                             Description
//                         </label>
//
//                         <input id="create-category-label"
//                                name="description"
//                                type="text"
//                                className={formStyles.formInput}
//                                required/>
//                     </div>
//
//                     <div className={formStyles.formField}>
//                         <label className={formStyles.formLabel} htmlFor="create-category-sort-order">
//                             Order
//                         </label>
//
//                         <input id="create-category-sort-order"
//                                name="sortOrder"
//                                className={formStyles.formInput}
//                                type="number"
//                                defaultValue={0}
//                                required/>
//                     </div>
//                 </div>
//
//                 <div className={formStyles.formActions}>
//                     <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
//                         Create
//                     </button>
//                 </div>
//             </form>
//         </MainContentPanel>
//     );
// }
