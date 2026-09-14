import {AdminEditUserForm} from "@/core/admin/components/admin-edit-user-form";
import {requireRoles} from "@/core/auth/lib/require-roles";
import {requireSession} from "@/core/auth/lib/require-session";
import {BreadcrumbLabel} from "@/core/dashboard/components/breadcrumb-label";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {User} from "better-auth";
import {JSX} from "react";

/**
 * Properties for the AdminEditUserPage component.
 *
 * @property {Promise<{ userId: string }>} params - A promise that resolves to the route parameters containing the
 *                                                  user ID.
 */
type PageProps = {
    params: Promise<{ userId: string }>;
};

/**
 * A page that allows administrators to edit a user's details.
 *
 * @param {PageProps} props - The component properties
 * @param {Promise<{ userId: string }>} props.params - Route parameter promise containing the ID of the user being
 *                                                     edited.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the admin user edit dashboard UI.
 */
export default async function AdminEditUserPage({params}: PageProps): Promise<JSX.Element> {
    const {userId} = await params;
    const session = await requireSession();
    const user = session.user as User;
    const role = await requireRoles(userId)

    return (
        <div>
            <BreadcrumbLabel segment={userId} label={user.name ?? undefined}/>

            <PageHeader eyebrow={"Viewing Profile Details For..."}
                        title={user.name + " (" + user.email + ")"}
                        subtitle={"Update this user's account details."}/>

            <AdminEditUserForm userId={user.id}
                               currentName={user.name ?? ""}
                               currentEmail={user.email}
                               currentRole={role.toString() ?? "user"}
                               isCurrentUser={user.id === userId}/>
        </div>
    );
}
