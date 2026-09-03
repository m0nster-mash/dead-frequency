"use client";

import {AdminForumControls} from "@/feature/forum/components/admin-forum-controls";
import {AdminThreadControls} from "@/feature/forum/components/admin-thread-controls";
import styles from "@/feature/forum/styles/forum.module.css";
import {useState} from "react";
import GearIcon from "@/shared/svg/bootstrap-gear-icon.svg";

type ThreadAdminButtonProps = {
    threadId: string;
    threadTitle: string;
};

export function ThreadAdminButton({
                                      threadId,
                                      threadTitle,
                                  }: ThreadAdminButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button"
                    className={styles.adminThreadButton}
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
