// import {AdminPostingStatusForm} from "@/core/admin/components/admin-posting-status-form";
// import {applyPostingStatusAction} from "@/core/admin/lib/actions";
// import {requireSession} from "@/core/auth/lib/require-session";
// import {requireUser} from "@/core/auth/lib/require-user";
// import {BreadcrumbLabel} from "@/core/dashboard/components/breadcrumb-label";
// import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
// import {PageHeader} from "@/core/dashboard/components/panels/page-header";
// import formStyle from "@/shared/styles/form.module.css";
// import {auth} from "@/core/auth";
// import buttonStyles from "@/shared/styles/buttons.module.css";
// import EditIcon from "@/shared/svg/bootstrap-edit-icon.svg";
// import {headers} from "next/headers";
// import Link from "next/link";
// import {JSX} from "react";
//
// /**
//  * Properties for the AdminUserDetailsPage component.
//  *
//  * @property {Promise<{ userId: string }>} params - A promise resolving to route parameters containing the targeted
//  * user ID.
//  */
// type PageProps = {
//     params: Promise<{ userId: string }>;
// };
//
// /**
//  * Formats a raw date value into a localized date and time string
//  *
//  * @param {string | Date | null | undefined} value - The date value to format
//  * @returns {string} The localized date and time string, or an em-dash ("—") if the input value is invalid or false
//  */
// function formatDate(value: string | Date | null | undefined): string {
//     if (!value) return "—";
//     return new Date(value).toLocaleString();
// }
//
// /**
//  * A page that renders detailed profile, activity, and configuration options for a single user account.
//  *
//  * @param {PageProps} props - The component properties
//  * @param {Promise<{ userId: string }>} props.params - Route parameter promise containing the ID of the user being
//  *                                                     viewed.
//  *
//  * @returns {Promise<JSX.Element>} A promise resolving to the admin user management profile viewport.
//  */
// export default async function AdminUserDetailsPage({params}: PageProps): Promise<JSX.Element> {
//     const {userId} = await params;
//     const requestHeaders = await headers();
//     await requireSession({role: "admin"});
//
//     let sessions: Array<{
//         createdAt: string | Date;
//         updatedAt?: string | Date | null
//     }> = [];
//
//     const user = await requireUser(userId, {
//         headers: requestHeaders,
//         context: "admin/details",
//     });
//
//     // Fetch active session history for tracking administrative details
//     try {
//         const result = await auth.api.listUserSessions({
//             body: {userId},
//             headers: requestHeaders,
//         });
//         sessions = result.sessions;
//     } catch (error) {
//         console.error("[admin/details] listUserSessions failed", error);
//     }
//
//     // Isolate the single most recent session based on modern update or creation stamps
//     const mostRecentSession = sessions
//         .slice()
//         .sort(
//             (a, b) =>
//                 new Date(b.updatedAt || b.createdAt).getTime() -
//                 new Date(a.updatedAt || a.createdAt).getTime(),
//         )[0];
//
//     // Structured metadata dictionary optimized for grid dashboard data rendering
//     const details = [
//         {label: "User ID", value: user.id},
//         {label: "Name", value: user.name || "—"},
//         {label: "Email", value: user.email},
//         {label: "Email verified", value: user.emailVerified ? "Yes" : "No"},
//         {label: "Role", value: user.role || "user"},
//         {
//             label: "Status",
//             value: user.banned
//                 ? `Banned${user.banReason ? ` (${user.banReason})` : ""}`
//                 : "Active",
//         },
//         {label: "Registered", value: formatDate(user.createdAt)},
//         {label: "Last updated", value: formatDate(user.updatedAt)},
//         {
//             label: "Last active",
//             value: mostRecentSession
//                 ? formatDate(mostRecentSession.updatedAt || mostRecentSession.createdAt)
//                 : "No recorded sessions",
//         },
//         {label: "Active sessions", value: String(sessions.length)},
//     ];
//
//     return (
//         <div>
//             <BreadcrumbLabel segment={userId} label={user.name ?? undefined}/>
//
//             <PageHeader eyebrow={"Viewing Profile Details For..."}
//                         title={user.name || user.email}
//                         subtitle={"User details"}/>
//
//             <MainContentPanel title={"User Details"}>
//                 <section>
//                     <dl className={formStyle.detailList}>
//                         {details.map((item) => (
//                             <div key={item.label} className={formStyle.detailRow}>
//                                 <dt className={formStyle.detailLabel}> {item.label} </dt>
//                                 <dd className={formStyle.detailValue}> {item.value} </dd>
//                             </div>
//                         ))}
//                     </dl>
//                 </section>
//             </MainContentPanel>
//
//             <MainContentPanel title={"Admin Actions"}>
//                 <div className={formStyle.formActions}>
//                     <Link href={`/admin/users/${user.id}/edit`}
//                           className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
//                         <EditIcon/> Edit user
//                     </Link>
//                 </div>
//             </MainContentPanel>
//
//             <AdminPostingStatusForm userId={user.id} onSubmitAction={applyPostingStatusAction}/>
//         </div>
//     );
// }
