export interface ModuleUser {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
}

export interface CharacterOwnerRef {
    ownerUserId: string;
}

/**
 * Interface contract for character authorization capability checks.
 * Implemented by host layer in `src/adapters/host-auth-adapter.ts`.
 */
export interface CharacterAuthAdapter {
    getCurrentUser(): Promise<ModuleUser | null>;

    canCreateCharacter(user: ModuleUser): Promise<boolean>;

    canEditCharacter(user: ModuleUser, character: CharacterOwnerRef): Promise<boolean>;

    canDeleteCharacter(user: ModuleUser, character: CharacterOwnerRef): Promise<boolean>;
}
