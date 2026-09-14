export interface ModuleUser {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
}

export interface AvatarAuthAdapter {
    getCurrentUser(): Promise<ModuleUser | null>;

    canUpdateAvatar(user: ModuleUser): Promise<boolean>;
}
