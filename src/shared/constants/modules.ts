/**
 * System Module Identifiers & Metadata Constants
 */

export const MODULE_KEYS = {
    FORUMS: 'FORUMS',
    GUILDS: 'GUILDS',
    BLOGS: 'BLOGS',
    CHATBOX: 'CHATBOX',
    CHATROOM: 'CHATROOM',
    DMS: 'DMS',
    AVATARS: 'AVATARS',
    ECONOMY: 'ECONOMY',
    CHARACTERS: 'CHARACTERS',
    NOTIFICATIONS: 'NOTIFICATIONS',
    REACTIONS: 'REACTIONS',
} as const;

export type SystemModuleKey = keyof typeof MODULE_KEYS;

export interface ModuleDefinition {
    key: SystemModuleKey;
    name: string;
    description: string;
    category: 'Communication' | 'Community' | 'Identity' | 'System';
    defaultEnabled: boolean;
}

export const SYSTEM_MODULES_METADATA: Record<SystemModuleKey, ModuleDefinition> = {
    [MODULE_KEYS.FORUMS]: {
        key: MODULE_KEYS.FORUMS,
        name: 'Forums System',
        description: 'Categories, Boards, Threads, and Flat Reply Posts.',
        category: 'Communication',
        defaultEnabled: true,
    },
    [MODULE_KEYS.GUILDS]: {
        key: MODULE_KEYS.GUILDS,
        name: 'Guilds Engine',
        description: 'Sub-communities with scoped contexts, rosters, and custom themes.',
        category: 'Community',
        defaultEnabled: true,
    },
    [MODULE_KEYS.BLOGS]: {
        key: MODULE_KEYS.BLOGS,
        name: 'Blogs & News',
        description: 'User blogs, character journals, and official admin announcements.',
        category: 'Communication',
        defaultEnabled: true,
    },
    [MODULE_KEYS.CHATBOX]: {
        key: MODULE_KEYS.CHATBOX,
        name: 'Portable Chatbox',
        description: 'Embedded real-time shoutbox widget across site contexts.',
        category: 'Communication',
        defaultEnabled: true,
    },
    [MODULE_KEYS.CHATROOM]: {
        key: MODULE_KEYS.CHATROOM,
        name: 'Chatrooms',
        description: 'Dedicated multi-channel persistent chat application.',
        category: 'Communication',
        defaultEnabled: true,
    },
    [MODULE_KEYS.DMS]: {
        key: MODULE_KEYS.DMS,
        name: 'Direct Messaging',
        description: 'Private 1x1 messaging with participant settings and audit trails.',
        category: 'Communication',
        defaultEnabled: true,
    },
    [MODULE_KEYS.AVATARS]: {
        key: MODULE_KEYS.AVATARS,
        name: 'Avatars & Layering',
        description: 'Layered SVG avatar asset composition and unlocking engine.',
        category: 'Identity',
        defaultEnabled: true,
    },
    [MODULE_KEYS.ECONOMY]: {
        key: MODULE_KEYS.ECONOMY,
        name: 'Site Economy',
        description: 'Points balance accrual via posting and store interactions.',
        category: 'System',
        defaultEnabled: true,
    },
    [MODULE_KEYS.CHARACTERS]: {
        key: MODULE_KEYS.CHARACTERS,
        name: 'Characters & Personas',
        description: 'Roleplay persona entities, profile pages, and polymorphic posting.',
        category: 'Identity',
        defaultEnabled: true,
    },
    [MODULE_KEYS.NOTIFICATIONS]: {
        key: MODULE_KEYS.NOTIFICATIONS,
        name: 'Notification Engine',
        description: 'Centralized notification hub, unread badges, and smart navigation.',
        category: 'System',
        defaultEnabled: true,
    },
    [MODULE_KEYS.REACTIONS]: {
        key: MODULE_KEYS.REACTIONS,
        name: 'Polymorphic Reactions',
        description: 'Generic emoji interaction sub-system on posts, blogs, and comments.',
        category: 'System',
        defaultEnabled: true,
    },
};
