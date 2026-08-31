import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AdminEditUserForm} from "@/core/admin/components/admin-edit-user-form";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import styles from "@/shared/styles/form-panel.module.css";

type PageProps = {
    params: Promise<{ userId: string }>;
};

export default async function AdminEditUserPage({params}: PageProps) {
    const {userId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    let user;

    try {
        user = await auth.api.getUser({
            query: {id: userId},
            headers: requestHeaders,
        });
    } catch (error) {
        console.error("[admin/edit] getUser threw:", error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
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