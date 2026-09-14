// import React, { JSX } from "react";
// import { ChatboxProvider } from "@/../packages/feature-chatbox/src/components/chatbox-provider";
// import { ChatboxPanel } from "@/../packages/feature-chatbox/src/components/chatbox-panel";
// import { hostAuthAdapter } from "@/adapters/host-auth-adapter";
//
// /**
//  * Host page integrating the decoupled Chatbox module.
//  * Injects the concrete host adapter at the application boundary.
//  */
// export default async function ChatboxTestPage(): Promise<JSX.Element> {
//     return (
//         <main style={{ padding: "1.5rem" }}>
//             <h1>Chatbox Module Integration Test</h1>
//             <ChatboxProvider authAdapter={hostAuthAdapter}>
//                 <ChatboxPanel />
//             </ChatboxProvider>
//         </main>
//     );
// }
