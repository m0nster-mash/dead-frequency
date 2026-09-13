import {updateForumBoardAction} from "@/core/admin/lib/forum-actions";
import {requireSession} from "@/core/auth/lib/require-session";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {EditBoardPanel} from "@/feature/forum/components/admin/edit-board-panel";
import {getForumHierarchy} from "@/feature/forum/lib/queries";
import {notFound} from "next/navigation";
import {JSX} from "react";

type Props = {
    params: Promise<{
        boardId: string;
    }>;
};

export default async function ViewBoardPage({params,}: Props): Promise<JSX.Element> {
    await requireSession({role: "admin"});

    const {boardId} = await params;
    const categories = await getForumHierarchy();
    const board = categories
        .flatMap((category) => category.boards)
        .find((board) => board.id === boardId);

    if (!board) {
        notFound();
    }

    return (
        <div>
            <PageHeader eyebrow={"Administration"}
                        title={"Edit Board"}
                        subtitle={"Manage forum board configuration"}/>

            <EditBoardPanel board={board}
                            categories={categories}
                            updateBoardAction={updateForumBoardAction}/>
        </div>
    );
}
