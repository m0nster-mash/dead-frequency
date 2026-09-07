"use client";

import {ChatboxWidget, type ChatboxWidgetMessage} from "@/feature/chatbox/components/chatbox-widget";
import {JSX, useState} from "react";

/**
 * Mock client wrapper for the chatbox widget.
 * Simulates fetching and sending messages.
 */
export function ChatboxWidgetClient(): JSX.Element {
    const [messages, setMessages] = useState<ChatboxWidgetMessage[]>([
        {
            id: "1",
            authorName: "Alice",
            body: "Hey everyone! Welcome to the chatbox.",
            deletedAt: null,
        },
        {
            id: "2",
            authorName: "Bob",
            body: "Thanks for setting this up!",
            deletedAt: null,
        },
        {
            id: "3",
            authorName: "Charlie",
            body: "This is a simple test message.",
            deletedAt: null,
        },
    ]);

    // Mock fetch function
    const handleFetchMessages = async (): Promise<ChatboxWidgetMessage[]> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        return messages;
    };

    // Mock send function
    const handleSendMessage = async (body: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newMessage: ChatboxWidgetMessage = {
            id: Date.now().toString(),
            authorName: "Current User",
            body,
            deletedAt: null,
        };

        setMessages((prev) => [...prev, newMessage]);
    };

    // Mock delete function
    const handleDeleteMessage = async (messageId: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === messageId ? {...msg, deletedAt: new Date()} : msg
            )
        );
    };

    return (
        <ChatboxWidget
            conversationId="test-conv"
            onFetchMessagesAction={handleFetchMessages}
            onSendMessageAction={handleSendMessage}
            onDeleteMessageAction={handleDeleteMessage}
            canModerate={true}
            refreshInterval={2000}
        />
    );
}
