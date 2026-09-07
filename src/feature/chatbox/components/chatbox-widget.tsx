"use client";

import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import {JSX, useEffect, useRef, useState} from "react";

export type ChatboxWidgetMessage = {
    id: string;
    authorName: string | null;
    body: string;
    deletedAt?: Date | null;
};

type ChatboxWidgetProps = {
    conversationId: string;
    onFetchMessagesAction: () => Promise<ChatboxWidgetMessage[]>;
    onSendMessageAction: (body: string) => Promise<void>;
    onDeleteMessageAction?: (messageId: string) => Promise<void>;
    canModerate?: boolean;
    refreshInterval?: number; // in milliseconds, default 2000
};

/**
 * A simple chatbox widget with a message list and message input.
 * Automatically refreshes messages at a specified interval.
 * Messages are displayed with username and optional admin delete button.
 */
export function ChatboxWidget({
                                  conversationId,
                                  onFetchMessagesAction,
                                  onSendMessageAction,
                                  onDeleteMessageAction,
                                  canModerate = false,
                                  refreshInterval = 2000,
                              }: ChatboxWidgetProps): JSX.Element {
    const [messages, setMessages] = useState<ChatboxWidgetMessage[]>([]);
    const [messageBody, setMessageBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const refreshIntervalRef = useRef<NodeJS.Timeout>();

    // Fetch messages from server
    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const newMessages = await onFetchMessagesAction();
            setMessages(newMessages);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // Set up auto-refresh interval
    useEffect(() => {
        // Fetch immediately on mount
        fetchMessages();

        // Set up interval for refreshing
        refreshIntervalRef.current = setInterval(fetchMessages, refreshInterval);

        // Cleanup interval on unmount
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [conversationId, refreshInterval]);

    // Handle sending a message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!messageBody.trim()) return;

        try {
            setIsSending(true);
            await onSendMessageAction(messageBody);
            setMessageBody("");
            // Refresh messages immediately after sending
            await fetchMessages();
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    // Handle deleting a message
    const handleDeleteMessage = async (messageId: string) => {
        if (!onDeleteMessageAction) return;

        try {
            await onDeleteMessageAction(messageId);
            await fetchMessages();
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    return (
        <div className={chatboxStyles.chatboxWidget}>
            {/* Messages Area */}
            <div className={chatboxStyles.messagesArea}>
                {messages.length === 0 ? (
                    <div className={chatboxStyles.noMessages}>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <div className={chatboxStyles.messagesList}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${chatboxStyles.messageRow} ${
                                    msg.deletedAt ? chatboxStyles.messageRowDeleted : ""
                                }`}
                            >
                                <div className={chatboxStyles.messageContent}>
                                    <div className={chatboxStyles.messageHeader}>
                                        <span className={chatboxStyles.userName}>
                                            {msg.authorName || "Unknown"}
                                        </span>
                                    </div>
                                    <div className={chatboxStyles.messageBody}>
                                        {msg.deletedAt ? (
                                            <em className={chatboxStyles.deletedMessage}>
                                                This message was deleted
                                            </em>
                                        ) : (
                                            <p className={chatboxStyles.messageText}>
                                                {msg.body}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {canModerate && !msg.deletedAt && onDeleteMessageAction && (
                                    <button
                                        type="button"
                                        className={chatboxStyles.deleteButton}
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        title="Delete message"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className={chatboxStyles.divider} />

            {/* Message Input Area */}
            <form className={chatboxStyles.inputForm} onSubmit={handleSendMessage}>
                <textarea
                    className={chatboxStyles.messageInput}
                    placeholder="Type a message..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    disabled={isSending}
                    rows={2}
                />
                <button
                    type="submit"
                    className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}
                    disabled={isSending || !messageBody.trim()}
                >
                    {isSending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
}
