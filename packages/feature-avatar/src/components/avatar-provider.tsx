"use client";

import React, {createContext, ReactNode, useContext} from "react";
import type {AvatarAuthAdapter} from "../contracts/auth";
import type {AvatarDataAdapter} from "../contracts/data";
import {createAvatarActions, SaveAvatarConfigResult} from "../lib/actions";

interface AvatarContextValue {
    authAdapter: AvatarAuthAdapter;
    saveAvatarConfig: (input: unknown) => Promise<SaveAvatarConfigResult>;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export interface AvatarProviderProps {
    authAdapter: AvatarAuthAdapter;
    dataAdapter: AvatarDataAdapter;
    children: ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({
                                                                  authAdapter,
                                                                  dataAdapter,
                                                                  children,
                                                              }) => {
    const {saveAvatarConfig} = createAvatarActions(authAdapter, dataAdapter);

    return (
        <AvatarContext.Provider value={{authAdapter, saveAvatarConfig}}>
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
