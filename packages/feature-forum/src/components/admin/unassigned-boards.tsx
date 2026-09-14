// import {ForumBoard, ForumCategory} from "@/feature/forum/components/admin/view-category-content";
//
// import adminStyles from "@/feature/forum/styles/admin.module.css";
// import Placeholder from "@/shared/components/placeholder";
// import buttonStyles from "@/shared/styles/buttons.module.css";
// import formStyles from "@/shared/styles/form.module.css";
// import Link from "next/link";
// import {JSX} from "react";
//
// type Props = {
//     board: ForumBoard;
//     categories: ForumCategory[];
//     assignCategoryAction?: (formData: FormData) => Promise<void>;
// };
//
// /**
//  * Displays a forum board which currently has no parent category.
//  */
// export function UnassignedBoard({board, categories, assignCategoryAction}: Props): JSX.Element {
//     return (
//         <tr className={adminStyles.unassignedBoardRow}>
//             <td>
//                 <div className={adminStyles.unassignedBoardName}>
//                     {board.label}
//                 </div>
//             </td>
//
//             <td>
//                 <div className={adminStyles.unassignedBoardDescription}>
//                     {board.description || "—"}
//                 </div>
//             </td>
//
//             <td className={adminStyles.forumStatisticCell}>
//                 <Placeholder text={"BOARD_TOTAL_THREADS"}/>
//             </td>
//
//             <td>
//                 {assignCategoryAction ? (
//                     <form action={assignCategoryAction}
//                           className={adminStyles.assignCategoryForm}>
//                         <input type="hidden"
//                                name="boardId"
//                                value={board.id}/>
//
//                         <select name="categoryId"
//                                 className={formStyles.formInput}
//                                 defaultValue=""
//                                 required>
//                             <option value="" disabled>
//                                 Select category...
//                             </option>
//
//                             {categories.map((category) => (
//                                 <option key={category.id} value={category.id}>
//                                     {category.label}
//                                 </option>
//                             ))}
//                         </select>
//
//                         <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
//                             Assign
//                         </button>
//                     </form>
//                 ) : (
//                     <Placeholder text={"ASSIGN_CATEGORY_ACTION"}/>
//                 )}
//             </td>
//
//             <td className={adminStyles.forumActionCell}>
//                 <Link href={`/admin/forum/boards/${board.id}`} className={adminStyles.forumEditButton}>
//                     Edit
//                 </Link>
//             </td>
//         </tr>
//     );
// }
