"use client";

import {AdminForumControls} from "@/_feature/forum/components/admin/admin-forum-controls";
import {AdminThreadControls} from "@/_feature/forum/components/admin/admin-thread-controls";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import GearIcon from "@/_shared/svg/bootstrap-gear-icon.svg";
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
