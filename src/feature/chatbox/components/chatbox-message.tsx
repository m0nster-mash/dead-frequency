"use client";

import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import {AvatarConfig} from "@/feature/avatar/lib/types";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import HeartIcon from "@/shared/svg/bootstrap-heart-icon.svg";
import Link from "next/link";
import {JSX} from "react";

type ChatboxMessageProps = {
    id: string;
    userId: string;
    username: string | null;
    authorEmail: string | null;
    avatarConfig?: AvatarConfig | null;
    body: string;
    createdAt: Date | string;
    deletedAt: Date | string | null;
    isAdmin?: boolean;
    likeCount?: number;
    hasLiked?: boolean;
    onLikeAction?: (messageId: string, targetUserId: string) => void;
    onDeleteAction?: (messageId: string) => void;
    onRestoreAction?: (messageId: string) => void;
    onReportAction?: (messageId: string, targetUserId: string) => void;
};

export function ChatboxMessage({
                                   id,
                                   userId,
                                   username,
                                   authorEmail,
                                   avatarConfig,
                                   body,
                                   createdAt,
                                   deletedAt,
                                   isAdmin = false,
                                   likeCount = 0,
                                   hasLiked = false,
                                   onLikeAction,
                                   onDeleteAction,
                                   onRestoreAction,
                                   onReportAction,
                               }: ChatboxMessageProps): JSX.Element {
    const displayName = username || authorEmail || "Anonymous";
    const isDeleted = !!deletedAt;
    const timestamp = new Date(createdAt).toLocaleString();
    const effectiveAvatarConfig = avatarConfig ?? DEFAULT_AVATAR_CONFIG;

    if (isDeleted && !isAdmin) {
        return <></>;
    }

    return (
        <div className={chatboxStyles.messageContainer}>
            <div className={chatboxStyles.messageAvatar}>
                <AvatarRenderer config={effectiveAvatarConfig} size={50}/>
            </div>
            <article className={`${chatboxStyles.message} ${isDeleted ? chatboxStyles.messageDeletedAdmin : ""}`}>
                <div className={chatboxStyles.messageHeader}>
                    <Link href={`/user/${userId}`} className={chatboxStyles.messageAuthorLink}>
                        {displayName}
                    </Link>
                    <time className={chatboxStyles.messageTime}>{timestamp}</time>
                    {isDeleted && isAdmin && (
                        <span className={chatboxStyles.deletedBadge}>[DELETED]</span>
                    )}
                </div>

                <div className={chatboxStyles.messageBody}>{body}</div>

                <div className={chatboxStyles.messageActions}>
                    {!isDeleted && (
                        <>
                            {onLikeAction && (
                                <button type="button"
                                        className={`${chatboxStyles.messageAction} ${hasLiked ? chatboxStyles.liked : ""}`}
                                        onClick={() => onLikeAction(id, userId)}>
                                    <HeartIcon/>
                                    {likeCount > 0 ? likeCount : "Like"}
                                </button>
                            )}

                            {onReportAction && (
                                <button type="button"
                                        className={chatboxStyles.messageAction}
                                        onClick={() => onReportAction(id, userId)}>
                                    Report
                                </button>
                            )}
                        </>
                    )}

                    {isAdmin && isDeleted && onRestoreAction && (
                        <button type="button"
                                className={chatboxStyles.messageAction}
                                onClick={() => onRestoreAction(id)}>
                            Restore
                        </button>
                    )}

                    {isAdmin && !isDeleted && onDeleteAction && (
                        <button type="button"
                                className={`${chatboxStyles.messageAction} ${chatboxStyles.messageActionDanger}`}
                                onClick={() => onDeleteAction(id)}>
                            Delete
                        </button>
                    )}
                </div>
            </article>
        </div>
    );
}
