import {AdminEditUserForm} from "@/core/admin/components/admin-edit-user-form";
import {auth} from "@/core/auth";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {JSX} from "react";

/**
 * Properties for the AdminEditUserPage component.
 *
 * @property {Promise<{ userId: string }>} params - A promise that resolves to the route parameters containing the
 * user ID
 */
type PageProps = {
    params: Promise<{ userId: string }>;
};

/**
 * A page that allows administrators to edit a user's details.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ userId: string }>} props.params - Route parameter promise containing the ID of the user being edited
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the admin user edit dashboard UI
 */
export default async function AdminEditUserPage({params}: PageProps): Promise<JSX.Element> {
    const {userId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    // TODO:: replace with centralized mechanism
    if (!session?.user) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    let user;

    // Fetch target user data from the authentication API
    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error("[admin/edit] getUser threw:", error);
        notFound();
    }

    // Data Validation Guard: Throw 404 if the requested user record does not exist
    if (!user) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={userId} label={user.name ?? undefined}/>

            <PageHeader eyebrow={"Viewing Profile Details For..."}
                        title={user.name + " (" + user.email + ")"}
                        subtitle={"Update this user's account details."}/>

            <AdminEditUserForm userId={user.id}
                               currentName={user.name ?? ""}
                               currentEmail={user.email}
                               currentRole={user.role ?? "user"}
                               isCurrentUser={user.id === session.user.id}/>
        </div>
    );
}
