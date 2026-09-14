// "use client";
//
// import React, {createContext, ReactNode, useContext} from "react";
// import type {ForumAuthAdapter} from "../contracts/auth";
//
// interface ForumContextValue {
//     authAdapter: ForumAuthAdapter;
// }
//
// const ForumContext = createContext<ForumContextValue | null>(null);
//
// export interface ForumProviderProps {
//     authAdapter: ForumAuthAdapter;
//     children: ReactNode;
// }
//
// export const ForumProvider: React.FC<ForumProviderProps> = ({
//                                                                 authAdapter,
//                                                                 children,
//                                                             }) => {
//     return (
//         <ForumContext.Provider value={{authAdapter}}>
//             {children}
//         </ForumContext.Provider>
//     );
// };
//
// export const useForum = (): ForumContextValue => {
//     const context = useContext(ForumContext);
//     if (!context) {
//         throw new Error("useForum must be used within a ForumProvider");
//     }
//     return context;
// };
