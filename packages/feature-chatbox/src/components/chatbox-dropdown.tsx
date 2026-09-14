// "use client";
//
// import {JSX, useState} from "react";
// import {ChatboxPanel} from "./chatbox-panel";
//
// type ChatboxDropdownProps = {
//     isAdmin?: boolean;
// };
//
// export function ChatboxDropdown({isAdmin = false}: ChatboxDropdownProps): JSX.Element {
//     const [isOpen, setIsOpen] = useState(false);
//
//     return (
//         <div className={dropdownStyles.dropdownWrapper}>
//             <button type="button"
//                     className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
//                     aria-label="ChatBox"
//                     aria-expanded={isOpen}
//                     onClick={() => setIsOpen((prev) => !prev)}>
//                 <ChatIcon/>
//             </button>
//
//             {isOpen && (
//                 <div className={dropdownStyles.dropdownMenu}>
//                     <ChatboxPanel isAdmin={isAdmin}/>
//                 </div>
//             )}
//         </div>
//     );
// }
