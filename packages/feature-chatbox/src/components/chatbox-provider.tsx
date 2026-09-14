// "use client";
//
// import React, {createContext, ReactNode, useContext} from "react";
// import type {ChatboxAuthAdapter} from "../contracts/auth";
//
// interface ChatboxContextValue {
//     authAdapter: ChatboxAuthAdapter;
// }
//
// const ChatboxContext = createContext<ChatboxContextValue | null>(null);
//
// export interface ChatboxProviderProps {
//     authAdapter: ChatboxAuthAdapter;
//     children: ReactNode;
// }
//
// /**
//  * Injects host-provided adapters into the Chatbox feature module boundary.
//  */
// export const ChatboxProvider: React.FC<ChatboxProviderProps> = ({
//                                                                     authAdapter,
//                                                                     children,
//                                                                 }) => {
//     return (
//         <ChatboxContext.Provider value={{authAdapter}}>
//             {children}
//         </ChatboxContext.Provider>
//     );
// };
//
// export const useChatbox = (): ChatboxContextValue => {
//     const context = useContext(ChatboxContext);
//     if (!context) {
//         throw new Error("useChatbox must be used within a ChatboxProvider");
//     }
//     return context;
// };
