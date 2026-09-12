"use client";

import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import {AvatarConfig} from "@/feature/avatar/lib/types";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX} from "react";

type ChatboxMessageProps = {
    id: string;
    authorName: string | null;
    authorEmail: string | null;
    avatarConfig?: AvatarConfig | null;
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
                                   avatarConfig,
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
    const effectiveAvatarConfig = avatarConfig ?? DEFAULT_AVATAR_CONFIG;

    if (isDeleted) {
        return (
            <div className={chatboxStyles.messageContainer}>
                <div className={chatboxStyles.messageAvatar}>
                    <AvatarRenderer config={effectiveAvatarConfig} size={50}/>
                </div>
                <article className={`${chatboxStyles.message} ${chatboxStyles.messageDeleted}`}>
                    <div className={chatboxStyles.messageHeader}>
                        <span className={chatboxStyles.messageAuthor}>{author}</span>
                        <time className={chatboxStyles.messageTime}>{timestamp}</time>
                    </div>
                    <div className={chatboxStyles.messageBody}>
                        [Message deleted]
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className={chatboxStyles.messageContainer}>
            <div className={chatboxStyles.messageAvatar}>
                <AvatarRenderer config={effectiveAvatarConfig} size={50}/>
            </div>
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
        </div>
    );
}
