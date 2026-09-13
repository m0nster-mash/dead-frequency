"use client";

import {AdminForumControls} from "@/feature/forum/components/admin/admin-forum-controls";
import {AdminThreadControls} from "@/feature/forum/components/admin/admin-thread-controls";
import buttonStyles from "@/shared/styles/buttons.module.css";
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";
import {useState} from "react";

type ThreadAdminButtonProps = {
    threadId: string;
    threadTitle: string;
};

export function ThreadAdminButton({threadId, threadTitle,}: ThreadAdminButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button"
                    className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                    onClick={() => setOpen(true)}
                    aria-label={`Manage thread: ${threadTitle}`}>
                <GearIcon/>
            </button>

            <AdminForumControls type="thread"
                                open={open}
                                onCloseAction={() => setOpen(false)}>
                <AdminThreadControls threadId={threadId}
                                     threadTitle={threadTitle}/>
            </AdminForumControls>
        </>
    );
}
