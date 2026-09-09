"use client";

import { JSX } from "react";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.modules.css";

type ChatboxMessageProps = {
    id: string;
    authorName: string | null;
    authorEmail: string | null;
    body: string;
    createdAt: Date | string;
    deletedAt: Date | string | null;
    isAdmin?: boolean;
    onDelete?: (messageId: string) => void;
    onEdit?: (messageId: string, body: string) => void;
};

export function ChatboxMessage({
                                   id,
                                   authorName,
                                   authorEmail,
                                   body,
                                   createdAt,
                                   deletedAt,
                                   isAdmin = false,
                                   onDelete,
                                   onEdit,
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
            {isAdmin && (onDelete || onEdit) && (
                <div className={chatboxStyles.messageActions}>
                    {onEdit && (
                        <button
                            type="button"
                            className={chatboxStyles.messageAction}
                            onClick={() => {
                                // TODO: Implement edit modal
                                console.log("Edit message:", id);
                            }}
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            className={`${chatboxStyles.messageAction} ${chatboxStyles.messageActionDanger}`}
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
