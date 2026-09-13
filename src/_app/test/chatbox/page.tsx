"use client";

import {PageHeader} from "@/_core/dashboard/components/panels/page-header";
import {ChatboxPanel} from "@/_feature/chatbox/components/chatbox-panel";

function ChatboxTextPage() {

    return (
        <div>
            <PageHeader
                eyebrow="Test Page"
                title="ChatBox Test Page"
                subtitle="An example of the chatbox feature"/>
            <ChatboxPanel/>
        </div>
    );
}

export default ChatboxTextPage;
