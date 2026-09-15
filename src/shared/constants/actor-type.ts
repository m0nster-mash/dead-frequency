/**
 * Polymorphic actor entity types across communication, social, and avatar modules.
 */
export const ACTOR_TYPES = ['USER', 'CHARACTER'] as const;
export type ActorType = (typeof ACTOR_TYPES)[number];

export const ActorType = {
    USER: 'USER',
    CHARACTER: 'CHARACTER',
} as const;

export const ACTOR_TYPE_LABELS: Record<ActorType, string> = {
    [ActorType.USER]: 'User',
    [ActorType.CHARACTER]: 'Character',
};
