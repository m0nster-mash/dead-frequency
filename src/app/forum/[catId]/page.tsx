import Link from "next/link";
import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {BreadcrumbLabel} from "@/shared/components/breadcrumb-label";
import styles from "@/shared/styles/form-panel.module.css";
import {getCategoryWithBoards} from "@/feature/forum/lib/queries";

type PageProps = {
    params: Promise<{ catId: string }>;
};

export default async function ForumCategoryPage({params}: PageProps) {
    const {catId} = await params;
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user) redirect("/login");

    const category = await getCategoryWithBoards(catId);
    if (!category) notFound();

    return (
        <div className={styles.wrapper}>
            <BreadcrumbLabel segment={catId} label={category.label}/>
            <PageHeader eyebrow={"Forum"} title={category.label} subtitle={"Boards in this category"}/>

            <MainContentPanel title={"Boards"}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Board</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {category.boards.map((board) => (
                            <tr key={board.id}>
                                <td>
                                    <Link href={`/forum/${category.id}/${board.id}`}>
                                        {board.label}
                                    </Link>
                                </td>
                                <td>{board.description || "—"}</td>
                            </tr>
                        ))}
                        {category.boards.length === 0 && (
                            <tr>
                                <td colSpan={2} className={styles.tableEmpty}>No boards in this category yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
