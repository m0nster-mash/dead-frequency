"use client";

import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX} from "react";

type ChatboxMessageProps = {
    id: string;
    authorName: string | null;
    authorEmail: string | null;
    body: string;
    createdAt: Date | string;
    deletedAt: Date | string | null;
    isAdmin?: boolean;
    onDeleteAction?: (messageId: string) => void;
    onEditAction?: (messageId: string, body: string) => void;
};

export function ChatboxMessage({
                                   id,
                                   authorName,
                                   authorEmail,
                                   body,
                                   createdAt,
                                   deletedAt,
                                   isAdmin = false,
                                   onDeleteAction,
                                   onEditAction,
                               }: ChatboxMessageProps): JSX.Element {
    const author = authorName || authorEmail || "Anonymous";
    const isDeleted = !!deletedAt;
    const timestamp = new Date(createdAt).toLocaleString();

    if (isDeleted) {
        return (
            <article className={`${chatboxStyles.message} ${chatboxStyles.messageDeleted}`}>
                <div className={chatboxStyles.messageHeader}>
                    <span className={chatboxStyles.messageAuthor}>{author}</span>
                    <time className={chatboxStyles.messageTime}>{timestamp}</time>
                </div>
                <div className={chatboxStyles.messageBody}>
                    [Message deleted]
                </div>
            </article>
        );
    }

    return (
        <article className={chatboxStyles.message}>
            <div className={chatboxStyles.messageHeader}>
                <span className={chatboxStyles.messageAuthor}>{author}</span>
                <time className={chatboxStyles.messageTime}>{timestamp}</time>
            </div>
            <div className={chatboxStyles.messageBody}>
                {body}
            </div>
            {isAdmin && (onDeleteAction || onEditAction) && (
                <div className={chatboxStyles.messageActions}>
                    {onEditAction && (
                        <button type="button"
                                className={chatboxStyles.messageAction}
                                onClick={() => {
                                    // TODO: Implement edit modal
                                    console.log("Edit message:", id);
                                }}>
                            Edit
                        </button>
                    )}
                    {onDeleteAction && (
                        <button type="button"
                                className={`${chatboxStyles.messageAction} ${chatboxStyles.messageActionDanger}`}
                                onClick={() => onDeleteAction(id)}>
                            Delete
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
