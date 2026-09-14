// "use client";
//
// import modalStyles from "@/shared/styles/modal.module.css";
// import CloseIcon from "@/shared/svg/bootstrap-close-icon.svg";
// import React, {ReactNode, useEffect, useRef} from "react";
//
// export type AdminForumControlType =
//     | "thread"
//     | "board"
//     | "category"
//     | "forum";
//
// type AdminForumControlsProps = {
//     type: AdminForumControlType;
//     open: boolean;
//     onCloseAction: () => void;
//     children?: ReactNode;
// };
//
// export function AdminForumControls({
//                                        type,
//                                        open,
//                                        onCloseAction,
//                                        children,
//                                    }: AdminForumControlsProps) {
//     const dialogRef = useRef<HTMLDialogElement>(null);
//
//     useEffect(() => {
//         const dialog = dialogRef.current;
//
//         if (!dialog) {
//             return;
//         }
//
//         if (open && !dialog.open) {
//             dialog.showModal();
//         }
//
//         if (!open && dialog.open) {
//             dialog.close();
//         }
//     }, [open]);
//
//     function handleClose() {
//         onCloseAction();
//     }
//
//     function handleBackdropClick(
//         event: React.MouseEvent<HTMLDialogElement>
//     ) {
//         if (event.target === event.currentTarget) {
//             handleClose();
//         }
//     }
//
//     return (
//         <dialog ref={dialogRef}
//                 onCancel={handleClose}
//                 onClose={handleClose}
//                 onClick={handleBackdropClick}>
//             <div>
//                 <div className={modalStyles.modalHeader}>
//                     <div>
//                         <span className={modalStyles.modalEyebrow}>
//                             Forum Administration
//                         </span>
//
//                         <h2 className={modalStyles.modalTitle}>
//                             {getControlTitle(type)}
//                         </h2>
//                     </div>
//
//                     <button type="button"
//                             className={modalStyles.modalCloseButton}
//                             onClick={handleClose}
//                             aria-label="Close administration controls">
//                         <CloseIcon/>
//                     </button>
//                 </div>
//
//                 <div className={modalStyles.modalBody}>
//                     {children}
//                 </div>
//             </div>
//         </dialog>
//     );
// }
//
// function getControlTitle(type: AdminForumControlType): string {
//     switch (type) {
//         case "thread":
//             return "Thread Controls";
//
//         case "board":
//             return "Board Controls";
//
//         case "category":
//             return "Category Controls";
//
//         case "forum":
//             return "Forum Controls";
//
//         default:
//             return "Administration";
//     }
// }
