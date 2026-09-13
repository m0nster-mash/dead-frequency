export interface HostModuleUser {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
}

export interface HostAuthAdapter {
    getCurrentUser(): Promise<HostModuleUser | null>;

    hasPermission?(user: HostModuleUser, action: string): Promise<boolean>;
}
