"use client";

import {ChatboxMessage} from "@/feature/chatbox/components/chatbox-message";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX, useEffect, useRef, useState} from "react";
import {createChatboxMessageAction, deleteChatboxMessageAction} from "../lib/actions";
import {getChatboxMessages} from "../lib/queries";
import {ChatboxInput} from "./chatbox-input";

type Message = {
    id: string;
    userId: string;
    body: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt: Date | string | null;
    authorName: string | null;
    authorEmail: string | null;
};

type ChatboxPanelProps = {
    isAdmin?: boolean;
    refreshInterval?: number;
};

export function ChatboxPanel({
                                 isAdmin = false,
                                 refreshInterval = 5000, // Refresh every 5 seconds
                             }: ChatboxPanelProps): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // Load messages on mount
    useEffect(() => {
        loadMessages();

        // Set up auto-refresh
        refreshIntervalRef.current = setInterval(() => {
            loadMessages();
        }, refreshInterval);

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [refreshInterval]);

    async function loadMessages() {
        try {
            const data = await getChatboxMessages(50);
            // Reverse to show oldest first visually (newest at bottom)
            setMessages((data as Message[]).reverse());
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load messages";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSendMessage(body: string) {
        setSubmitting(true);
        try {
            await createChatboxMessageAction({body});
            // Reload messages to show the new one
            await loadMessages();
        } catch (err) {
            throw err;
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDeleteMessage(messageId: string) {
        if (!confirm("Delete this message?")) {
            return;
        }

        try {
            await deleteChatboxMessageAction({messageId});
            await loadMessages();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete message";
            setError(message);
        }
    }

    return (
        <div className={chatboxStyles.chatboxWrapper}>
            <div className={chatboxStyles.chatboxMessages}>
                {loading ? (
                    <div className={chatboxStyles.chatboxMessagesEmpty}>
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className={chatboxStyles.chatboxMessagesEmpty}>
                        No messages yet. Be the first to chat!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatboxMessage key={msg.id}
                                        id={msg.id}
                                        authorName={msg.authorName}
                                        authorEmail={msg.authorEmail}
                                        body={msg.body}
                                        createdAt={msg.createdAt}
                                        deletedAt={msg.deletedAt}
                                        isAdmin={isAdmin}
                                        onDeleteAction={isAdmin ? handleDeleteMessage : undefined}/>
                    ))
                )}
                <div ref={messagesEndRef}/>
            </div>
            <ChatboxInput onSubmitAction={handleSendMessage}
                          isLoading={submitting}
                          error={error}
                          placeholder="Write a message..."/>
        </div>
    );
}
