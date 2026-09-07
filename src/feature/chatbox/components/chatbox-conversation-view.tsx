import {ChatboxMessage, ChatboxMessageProps} from "@/feature/chatbox/components/chatbox-message";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX, ReactNode} from "react";

type ChatboxConversationViewProps = {
    title: string;
    description?: string | null;
    messages: ChatboxMessageProps[];
    messageInput?: ReactNode;
    emptyMessage?: string;
};

/**
 * Main conversation view component displaying all messages in a thread.
 * Includes message list, message input form, and conversation metadata.
 */
export function ChatboxConversationView({
                                            title,
                                            description,
                                            messages,
                                            messageInput,
                                            emptyMessage = "No messages yet. Start the conversation!",
                                        }: ChatboxConversationViewProps): JSX.Element {
    return (
        <div className={chatboxStyles.conversationView}>
            <div className={chatboxStyles.conversationHeader}>
                <h2 className={chatboxStyles.conversationViewTitle}>{title}</h2>
                {description && (
                    <p className={chatboxStyles.conversationViewDescription}>
                        {description}
                    </p>
                )}
            </div>

            <div className={chatboxStyles.messageList}>
                {messages.length === 0 ? (
                    <div className={chatboxStyles.messageListEmpty}>
                        {emptyMessage}
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatboxMessage
                            key={message.id}
                            {...message}
                        />
                    ))
                )}
            </div>

            {messageInput && (
                <div className={chatboxStyles.conversationFooter}>
                    {messageInput}
                </div>
            )}
        </div>
    );
}
