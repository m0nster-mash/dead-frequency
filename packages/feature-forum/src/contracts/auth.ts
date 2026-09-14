export interface ModuleUser {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
}

export interface ForumAuthAdapter {
    getCurrentUser(): Promise<ModuleUser | null>;

    canCreateThread(user: ModuleUser, boardId: string): Promise<boolean>;

    canCreatePost(user: ModuleUser, threadId: string): Promise<boolean>;

    canModerateBoard(user: ModuleUser, boardId: string): Promise<boolean>;
}
