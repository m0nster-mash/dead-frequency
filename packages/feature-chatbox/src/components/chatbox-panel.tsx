// "use client";
//
// import React, {JSX, useEffect, useState} from "react";
// import type {ModuleUser} from "../contracts/auth";
// import styles from "../styles/chatbox.module.css";
// import {useChatbox} from "./chatbox-provider";
//
// interface Message {
//     id: string;
//     userId: string;
//     message: string;
//     createdAt: string;
// }
//
// interface ChatboxPanelProps {
//     initialMessages?: Message[];
//     onSendMessage?: (message: string) => Promise<void>;
// }
//
// /**
//  * Decoupled Chatbox Panel component.
//  * Uses package-internal CSS modules and injected IoC auth adapters.
//  */
// export function ChatboxPanel({
//                                  initialMessages = [],
//                                  onSendMessage,
//                              }: ChatboxPanelProps): JSX.Element {
//     const {authAdapter} = useChatbox();
//     const [currentUser, setCurrentUser] = useState<ModuleUser | null>(null);
//     const [inputMessage, setInputMessage] = useState("");
//     const [canPost, setCanPost] = useState(false);
//
//     useEffect(() => {
//         async function loadUserPermission() {
//             const user = await authAdapter.getCurrentUser();
//             setCurrentUser(user);
//             if (user) {
//                 const allowed = await authAdapter.canPostMessage(user);
//                 setCanPost(allowed);
//             }
//         }
//
//         loadUserPermission();
//     }, [authAdapter]);
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!inputMessage.trim() || !canPost || !onSendMessage) return;
//         await onSendMessage(inputMessage);
//         setInputMessage("");
//     };
//
//     return (
//         <div className={styles.chatboxContainer}>
//             <div className={styles.chatboxHeader}>
//                 <h3>Shoutbox</h3>
//                 {currentUser ? (
//                     <span className={styles.userBadge}>Logged in as {currentUser.name}</span>
//                 ) : (
//                     <span className={styles.guestBadge}>Guest</span>
//                 )}
//             </div>
//
//             <div className={styles.messageList}>
//                 {initialMessages.map((msg) => (
//                     <div key={msg.id} className={styles.messageItem}>
//                         <span className={styles.messageUser}>{msg.userId}: </span>
//                         <span className={styles.messageText}>{msg.message}</span>
//                     </div>
//                 ))}
//             </div>
//
//             {currentUser && canPost ? (
//                 <form onSubmit={handleSubmit} className={styles.inputForm}>
//                     <input
//                         type="text"
//                         className={styles.textInput}
//                         value={inputMessage}
//                         onChange={(e) => setInputMessage(e.target.value)}
//                         placeholder="Type a message..."
//                     />
//                     <button type="submit" className={styles.sendButton}>
//                         Send
//                     </button>
//                 </form>
//             ) : (
//                 <div className={styles.disabledNotice}>
//                     Please log in to post messages.
//                 </div>
//             )}
//         </div>
//     );
// }
