"use client";

import React, {createContext, ReactNode, useContext} from "react";
import type {SaveAvatarConfigResult} from "../lib/actions";

interface AvatarContextValue {
    saveAvatarConfig: (input: unknown) => Promise<SaveAvatarConfigResult>;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export interface AvatarProviderProps {
    saveAvatarConfig: (input: unknown) => Promise<SaveAvatarConfigResult>;
    children: ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({
                                                                  saveAvatarConfig,
                                                                  children,
                                                              }) => {
    return (
        <AvatarContext.Provider value={{saveAvatarConfig}}>
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
