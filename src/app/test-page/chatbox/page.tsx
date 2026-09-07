import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {ChatboxWidgetClient} from "@/feature/chatbox/components/chatbox-widget-client";
import {JSX} from "react";

/**
 * Simple test page for the chatbox widget.
 * Displays a single chatbox widget and demonstrates the message list + input functionality.
 */
export default function ChatboxTestPage(): JSX.Element {
    return (
        <div>
            <PageHeader
                eyebrow="Testing"
                title="Chatbox Widget"
                subtitle="Simple panel with message list and input"
            />

            <MainContentPanel title="Chatbox Demo">
                <p>
                    This is a simple chatbox widget with a message list above and message input below.
                    Messages are auto-refreshed every 2 seconds.
                </p>
            </MainContentPanel>

            <MainContentPanel title="Conversation">
                <ChatboxWidgetClient />
            </MainContentPanel>
        </div>
    );
}
