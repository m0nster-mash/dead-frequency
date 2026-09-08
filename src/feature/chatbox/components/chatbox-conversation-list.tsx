import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import Placeholder from "@shared/components/placeholder";
import Link from "next/link";
import {JSX} from "react";

export type ConversationListItem = {
    id: string;
    title: string;
    description?: string | null;
    messageCount: string | number;
    lastMessageAt: Date;
    createdByUserName?: string | null;
    href: string;
};

type ChatboxConversationListProps = {
    conversations: ConversationListItem[];
    emptyMessage?: string;
};

/**
 * Displays a scrollable list of chatbox conversations sorted by most recent activity.
 * Includes conversation metadata like message count and last activity timestamp.
 */
export function ChatboxConversationList({
                                            conversations,
                                            emptyMessage = "No conversations yet. Start one to get chatting!",
                                        }: ChatboxConversationListProps): JSX.Element {
    if (conversations.length === 0) {
        return (
            <div className={chatboxStyles.conversationListEmpty}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={chatboxStyles.conversationList}>
            {conversations.map((conversation) => (
                <Link
                    key={conversation.id}
                    href={conversation.href}
                    className={chatboxStyles.conversationRow}
                >
                    <div className={chatboxStyles.conversationMain}>
                        <h3 className={chatboxStyles.conversationTitle}>
                            {conversation.title}
                        </h3>

                        <p className={chatboxStyles.conversationDescription}>
                            {conversation.description || "—"}
                        </p>

                        <p className={chatboxStyles.conversationMeta}>
                            by {conversation.createdByUserName || "Unknown"} · Last message{" "}
                            {new Date(conversation.lastMessageAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className={chatboxStyles.conversationStats}>
                        <div className={chatboxStyles.stat}>
                            <span className={chatboxStyles.statValue}>
                                {conversation.messageCount}
                            </span>
                            <span className={chatboxStyles.metaLabel}>Messages</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
