import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX, ReactNode} from "react";

export type ChatboxMessageProps = {
    id: string;
    authorName?: string | null;
    authorEmail?: string | null;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    isEdited?: boolean;
    actions?: ReactNode;
};

/**
 * Renders a single message in a conversation thread.
 * Displays author info, message body, timestamps, and optional actions.
 * Handles deleted messages with special styling.
 */
export function ChatboxMessage({
                                   id,
                                   authorName,
                                   authorEmail,
                                   body,
                                   createdAt,
                                   updatedAt,
                                   deletedAt,
                                   isEdited,
                                   actions,
                               }: ChatboxMessageProps): JSX.Element {
    const isDeleted = !!deletedAt;
    const displayName = authorName || authorEmail || "Anonymous";

    return (
        <div
            className={`${chatboxStyles.message} ${isDeleted ? chatboxStyles.messageDeleted : ""}`}
            data-message-id={id}
        >
            <div className={chatboxStyles.messageHeader}>
                <div className={chatboxStyles.messageAuthor}>
                    <span className={chatboxStyles.authorName}>
                        {displayName}
                    </span>
                    <span className={chatboxStyles.messageTimestamp}>
                        {createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {isEdited && (
                        <span className={chatboxStyles.messageEdited}>
                            (edited)
                        </span>
                    )}
                </div>

                {actions && (
                    <div className={chatboxStyles.messageActions}>
                        {actions}
                    </div>
                )}
            </div>

            <div className={chatboxStyles.messageBody}>
                {isDeleted ? (
                    <em className={chatboxStyles.deletedMessageText}>
                        This message was deleted by a moderator
                    </em>
                ) : (
                    <p className={chatboxStyles.messageText}>{body}</p>
                )}
            </div>
        </div>
    );
}
