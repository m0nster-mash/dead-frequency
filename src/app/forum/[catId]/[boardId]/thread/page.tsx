// import {requireSession} from "@/core/auth/lib/require-session";
// import {BreadcrumbLabel} from "@/core/dashboard/components/breadcrumb-label";
// import {PageHeader} from "@/core/dashboard/components/panels/page-header";
// import forumStyles from "@/feature/forum/styles/forum.module.css";
// import Placeholder from "@shared/components/placeholder";
// import {notFound} from "next/navigation";
// import {JSX} from "react";
// import {CreateReplyPanel} from "../../../../../../packages/feature-forum/src/components/create-reply-panel";
// import {replyToThreadAction} from "../../../../../../packages/feature-forum/src/lib/actions";
// import {getThreadWithPosts} from "../../../../../../packages/feature-forum/src/lib/queries";
//
// /**
//  * Properties for the ForumThreadPage component.
//  *
//  * @property {Promise<{ catId: string; boardId: string; threadId: string }>} params - A promise resolving to the
//  * nested dynamic route parameters.
//  */
// type PageProps = {
//     params: Promise<{
//         catId: string;
//         boardId: string;
//         threadId: string;
//     }>;
// };
//
// /**
//  * A page that presents a forum thread discussion tree and an inline composition form.
//  *
//  * @param {PageProps} props - The component properties
//  * @param {Promise<{ catId: string; boardId: string; threadId: string }>} props.params - Route parameters containing
//  * the dynamic path hierarchy identifiers
//  *
//  * @returns {Promise<JSX.Element>} A promise resolving to the unified forum thread and post management layout UI
//  */
// export default async function ForumThreadPage({params}: PageProps): Promise<JSX.Element> {
//     const {boardId, threadId} = await params;
//     await requireSession();
//     const data = await getThreadWithPosts(threadId);
//
//     if (!data || data.thread.boardId !== boardId) {
//         notFound();
//     }
//
//     const threadAuthor =
//         data.thread.authorName ||
//         data.thread.authorEmail ||
//         "Unknown";
//
//     return (
//         <div>
//             <BreadcrumbLabel segment={threadId}
//                              label={data.thread.title}/>
//
//             <PageHeader eyebrow="Forum"
//                         title={data.thread.title}
//                         subtitle={`Started by ${threadAuthor}`}/>
//
//             <section className={forumStyles.threadDiscussion}>
//                 {data.posts.map((post, index) => {
//                     const author = post.authorName || post.authorEmail || "Unknown";
//
//                     return (
//                         <article key={post.id}
//                                  className={forumStyles.post}>
//                             <aside className={forumStyles.postSidebar}>
//                                 <div className={forumStyles.avatarPlaceholder}>
//                                     <Placeholder text={"avatar"}/>
//                                 </div>
//
//                                 <div className={forumStyles.postAuthor}>
//                                     {author}
//                                 </div>
//
//                                 <div className={forumStyles.postRank}>
//                                     <Placeholder text={"USER_RANK"}/>
//                                 </div>
//
//                                 <div className={forumStyles.postStats}>
//                                     <span>Posts: <Placeholder text={"POST_COUNT"}/></span>
//                                     <span>Joined: <Placeholder text={"join_date"}/></span>
//                                 </div>
//                             </aside>
//
//                             <div className={forumStyles.postContent}>
//                                 <header className={forumStyles.postHeader}>
//                                     <div className={forumStyles.postHeaderMeta}>
//                                         <span className={forumStyles.postNumber}>
//                                             #{index + 2}
//                                         </span>
//
//                                         <time className={forumStyles.postDate}>
//                                             {new Date(
//                                                 post.createdAt
//                                             ).toLocaleString()}
//                                         </time>
//                                     </div>
//
//                                     <div className={forumStyles.postActions}>
//                                         <button type="button"
//                                                 className={forumStyles.postAction}>
//                                             <Placeholder text={"quote"}/>
//                                         </button>
//
//                                         <button type="button"
//                                                 className={forumStyles.postAction}>
//                                             <Placeholder text={"report"}/>
//                                         </button>
//                                     </div>
//                                 </header>
//
//                                 <div className={forumStyles.postBody}>
//                                     {post.deletedAt ? (
//                                         <em className={forumStyles.deletedPost}>
//                                             This post has been deleted.
//                                         </em>
//                                     ) : (
//                                         post.body
//                                     )}
//                                 </div>
//
//                                 <footer className={forumStyles.postFooter}>
//                                     <span><Placeholder text={"permalink"}/></span>
//                                     <span><Placeholder text={"edit"}/></span>
//                                 </footer>
//                             </div>
//                         </article>
//                     );
//                 })}
//
//                 {data.posts.length === 0 && (
//                     <div className={forumStyles.discussionEmpty}>
//                         No replies yet.
//                     </div>
//                 )}
//             </section>
//
//             {/* Reply composer belongs after the discussion */}
//             <CreateReplyPanel
//                 title="Post Reply"
//                 submitLabel="Post Reply"
//                 action={async (formData) => {
//                     "use server";
//
//                     await replyToThreadAction({
//                         threadId,
//                         body: String(formData.get("body") || ""),
//                         replyToUserId:
//                             String(
//                                 formData.get("replyToUserId") || ""
//                             ) || undefined,
//                     });
//                 }}
//             />
//         </div>
//     );
// }
