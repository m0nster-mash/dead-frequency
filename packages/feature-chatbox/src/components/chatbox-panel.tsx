// "use client";
//
// import {authClient} from "@/core/auth/lib/auth-client";
// import {AvatarConfig} from "@/feature/avatar/lib/types";
// import {ChatboxMessage} from "@/feature/chatbox/components/chatbox-message";
// import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
// import {toggleReactionAction} from "@/shared/communication/interactions/lib/actions";
// import {ReportPanel} from "@shared/components/report-panel";
// import Link from "next/link";
// import {JSX, useEffect, useRef, useState} from "react";
// import {createChatboxMessageAction, deleteChatboxMessageAction, restoreChatboxMessageAction,} from "../lib/actions";
// import {getChatboxMessages} from "../lib/queries";
// import {ChatboxInput} from "./chatbox-input";
// import HeartIcon from "@/shared/svg/bootstrap-heart-icon.svg";
//
// type Message = {
//     id: string;
//     userId: string;
//     body: string;
//     createdAt: Date | string;
//     updatedAt: Date | string;
//     deletedAt: Date | string | null;
//     username: string | null;
//     authorEmail: string | null;
//     avatarConfig?: AvatarConfig | null;
//     likeCount?: number;
//     hasLiked?: boolean;
// };
//
// type ChatboxPanelProps = {
//     isAdmin?: boolean;
//     refreshInterval?: number;
// };
//
// type ReportingTarget = {
//     messageId: string;
//     targetUserId: string;
// } | null;
//
// export function ChatboxPanel({
//                                  isAdmin = false,
//                                  refreshInterval = 5000,
//                              }: ChatboxPanelProps): JSX.Element {
//     const {data: session, isPending: isSessionLoading} = authClient.useSession();
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [submitting, setSubmitting] = useState(false);
//     const [reportingTarget, setReportingTarget] = useState<ReportingTarget>(null);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
//     }, [messages]);
//
//     useEffect(() => {
//         loadMessages();
//
//         const intervalId = setInterval(() => {
//             loadMessages();
//         }, refreshInterval);
//
//         return () => clearInterval(intervalId);
//     }, [refreshInterval, session?.user?.id]);
//
//     async function loadMessages() {
//         try {
//             const currentUserId = session?.user?.id;
//             const data = await getChatboxMessages(50, undefined, isAdmin, currentUserId);
//             setMessages((data as Message[]).reverse());
//             setError(null);
//         } catch (err) {
//             const message = err instanceof Error ? err.message : "Failed to load messages";
//             setError(message);
//         } finally {
//             setLoading(false);
//         }
//     }
//
//     async function handleSendMessage(body: string) {
//         if (!session?.user) return;
//
//         const tempId = `temp-${Date.now()}`;
//         const optimisticMsg: Message = {
//             id: tempId,
//             userId: session.user.id,
//             username: session.user.name || null,
//             authorEmail: session.user.email || null,
//             body,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             deletedAt: null,
//             avatarConfig: null,
//             likeCount: 0,
//             hasLiked: false,
//         };
//
//         setMessages((prev) => [...prev, optimisticMsg]);
//         setSubmitting(true);
//
//         try {
//             await createChatboxMessageAction({body});
//             await loadMessages();
//         } catch (err) {
//             setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//             throw err;
//         } finally {
//             setSubmitting(false);
//         }
//     }
//
//     async function handleLikeMessage(messageId: string, targetUserId: string) {
//         if (!session?.user) return;
//
//         setMessages((prev) =>
//             prev.map((msg) => {
//                 if (msg.id === messageId) {
//                     const newHasLiked = !msg.hasLiked;
//                     const currentCount = msg.likeCount || 0;
//                     return {
//                         ...msg,
//                         hasLiked: newHasLiked,
//                         likeCount: newHasLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
//                     };
//                 }
//                 return msg;
//             })
//         );
//
//         try {
//             await toggleReactionAction({
//                 module: "chatbox",
//                 recordId: messageId,
//                 targetUserId,
//                 emoji: HeartIcon,
//             });
//             await loadMessages();
//         } catch (err) {
//             await loadMessages();
//             setError(err instanceof Error ? err.message : "Failed to toggle reaction");
//         }
//     }
//
//     async function handleDeleteMessage(messageId: string) {
//         if (!confirm("Delete this message?")) {
//             return;
//         }
//
//         try {
//             await deleteChatboxMessageAction({messageId});
//             await loadMessages();
//         } catch (err) {
//             const message = err instanceof Error ? err.message : "Failed to delete message";
//             setError(message);
//         }
//     }
//
//     async function handleRestoreMessage(messageId: string) {
//         try {
//             await restoreChatboxMessageAction({messageId});
//             await loadMessages();
//         } catch (err) {
//             const message = err instanceof Error ? err.message : "Failed to restore message";
//             setError(message);
//         }
//     }
//
//     return (
//         <div className={chatboxStyles.chatboxWrapper}>
//             <div className={chatboxStyles.chatboxMessages}>
//                 {loading ? (
//                     <div className={chatboxStyles.chatboxMessagesEmpty}>
//                         Loading messages...
//                     </div>
//                 ) : messages.length === 0 ? (
//                     <div className={chatboxStyles.chatboxMessagesEmpty}>
//                         No messages yet. Be the first to chat!
//                     </div>
//                 ) : (
//                     messages.map((msg) => (
//                         <ChatboxMessage key={msg.id}
//                                         id={msg.id}
//                                         userId={msg.userId}
//                                         username={msg.username}
//                                         authorEmail={msg.authorEmail}
//                                         avatarConfig={msg.avatarConfig}
//                                         body={msg.body}
//                                         createdAt={msg.createdAt}
//                                         deletedAt={msg.deletedAt}
//                                         isAdmin={isAdmin}
//                                         likeCount={msg.likeCount}
//                                         hasLiked={msg.hasLiked}
//                                         onLikeAction={session?.user ? handleLikeMessage : undefined}
//                                         onDeleteAction={isAdmin ? handleDeleteMessage : undefined}
//                                         onRestoreAction={isAdmin ? handleRestoreMessage : undefined}
//                                         onReportAction={(messageId, targetUserId) =>
//                                             setReportingTarget({messageId, targetUserId})
//                                         }/>
//                     ))
//                 )}
//                 <div ref={messagesEndRef}/>
//             </div>
//
//             {!isSessionLoading && session?.user ? (
//                 <ChatboxInput
//                     onSubmitAction={handleSendMessage}
//                     isLoading={submitting}
//                     error={error}
//                     placeholder="Write a message..."
//                 />
//             ) : (
//                 <div className={chatboxStyles.loggedOutNotice}>
//                     You must be{" "}
//                     <Link href="/login" className={chatboxStyles.loginLink}>
//                         logged in
//                     </Link>{" "}
//                     to post.
//                 </div>
//             )}
//
//             {/* Reusable Report Modal */}
//             {reportingTarget && (
//                 <ReportPanel module="chatbox"
//                              recordId={reportingTarget.messageId}
//                              targetUserId={reportingTarget.targetUserId}
//                              isOpen={!!reportingTarget}
//                              onCloseAction={() => setReportingTarget(null)}
//                              onSuccessAction={() => alert("Report submitted successfully.")}/>
//             )}
//         </div>
//     );
// }
