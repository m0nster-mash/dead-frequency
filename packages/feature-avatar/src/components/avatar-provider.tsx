"use client";

import React, {createContext, ReactNode, useContext} from "react";
import type {AvatarAuthAdapter} from "../contracts/auth";

interface AvatarContextValue {
    authAdapter: AvatarAuthAdapter;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export interface AvatarProviderProps {
    authAdapter: AvatarAuthAdapter;
    children: ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({
                                                                  authAdapter,
                                                                  children,
                                                              }) => {
    return (
        <AvatarContext.Provider value={{authAdapter}}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = (): AvatarContextValue => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error("useAvatar must be used within an AvatarProvider");
    }
    return context;
};
