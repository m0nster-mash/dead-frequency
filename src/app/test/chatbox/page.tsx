"use client";

import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {ChatboxPanel} from "@/feature/chatbox";

function ChatboxTextPage() {

    return (
        <div>
            <PageHeader
                eyebrow="Style Test"
                title="HTML Element Test Page"
                subtitle="An example of each major HTML element, for the purpose of testing out styles and themes."/>

            <ChatboxPanel/>
        </div>
    );
}

export default ChatboxTextPage;
