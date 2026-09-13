"use client";

import {authClient} from "@/core/auth/lib/auth-client";
import {AvatarConfig} from "@/feature/avatar/lib/types";
import {ChatboxMessage} from "@/feature/chatbox/components/chatbox-message";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import Link from "next/link";
import {JSX, useEffect, useRef, useState} from "react";
import {
    createChatboxMessageAction,
    deleteChatboxMessageAction,
    restoreChatboxMessageAction,
} from "../lib/actions";
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
    avatarConfig?: AvatarConfig | null;
};

type ChatboxPanelProps = {
    isAdmin?: boolean;
    refreshInterval?: number; // Time in milliseconds between message polls
};

export function ChatboxPanel({
                                 isAdmin = false,
                                 refreshInterval = 5000, // Default to polling every 5 seconds
                             }: ChatboxPanelProps): JSX.Element {
    const {data: session, isPending: isSessionLoading} = authClient.useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when new messages arrive or are optimistically added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // Initial load and recurring interval polling every `refreshInterval` ms
    useEffect(() => {
        loadMessages();

        const intervalId = setInterval(() => {
            loadMessages();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    async function handleRestoreMessage(messageId: string) {
        try {
            await restoreChatboxMessageAction({ messageId });
            await loadMessages();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to restore message";
            setError(message);
        }
    }

    async function loadMessages() {
        try {
            const data = await getChatboxMessages(50, undefined, isAdmin);
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
        if (!session?.user) return;

        // 1. Generate an optimistic temporary message
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: tempId,
            userId: session.user.id,
            authorName: session.user.name || null,
            authorEmail: session.user.email || null,
            body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            avatarConfig: null,
        };

        // 2. Immediately render optimistic message in UI
        setMessages((prev) => [...prev, optimisticMsg]);
        setSubmitting(true);

        try {
            // 3. Persist to server database
            await createChatboxMessageAction({body});

            // 4. Fetch actual server records to replace optimistic message with real ID & avatar state
            await loadMessages();
        } catch (err) {
            // Revert optimistic message if server action fails
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
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
                        <ChatboxMessage                            key={msg.id}
                            id={msg.id}
                            userId={msg.userId}
                            authorName={msg.authorName}
                            authorEmail={msg.authorEmail}
                            avatarConfig={msg.avatarConfig}
                            body={msg.body}
                            createdAt={msg.createdAt}
                            deletedAt={msg.deletedAt}
                            isAdmin={isAdmin}
                            onDeleteAction={isAdmin ? handleDeleteMessage : undefined}
                            onRestoreAction={isAdmin ? handleRestoreMessage : undefined}                        />
                    ))
                )}
                <div ref={messagesEndRef}/>
            </div>

            {!isSessionLoading && session?.user ? (
                <ChatboxInput onSubmitAction={handleSendMessage}
                              isLoading={submitting}
                              error={error}
                              placeholder="Write a message..."/>
            ) : (
                <div className={chatboxStyles.loggedOutNotice}>
                    You must be{" "}
                    <Link href="/login" className={chatboxStyles.loginLink}>
                        logged in
                    </Link>{" "}
                    to post.
                </div>
            )}
        </div>
    );
}
