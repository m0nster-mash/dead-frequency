export interface ModuleUser {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
}

export interface ChatboxAuthAdapter {
    getCurrentUser(): Promise<ModuleUser | null>;

    canPostMessage(user: ModuleUser): Promise<boolean>;
}
