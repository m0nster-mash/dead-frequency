# @app/feature-character

Isolated feature package for managing user roleplay character personas.

## Package Structure

```
packages/feature-character/
├── package.json           # Scoped package definition
├── tsconfig.json          # Independent TypeScript configuration
└── src/
├── index.ts           # Barrel export entrypoint
├── contracts/
│   └── auth.ts        # Local CharacterAuthAdapter port contract
├── schema/
│   └── character.schema.ts  # Isolated Drizzle schema (unconstrained ownerUserId)
├── lib/
│   ├── constants.ts   # Package audit action vocabulary & MAX_CHARACTERS_PER_USER = 10
│   ├── queries.ts     # Data retrieval queries
│   └── actions.ts     # Server actions (create, edit, soft-delete + audit logging)
├── styles/
│   └── character.module.css # Isolated CSS styles for character forms & cards
└── components/
├── character-create-form.tsx # Character creation form component
├── character-edit-form.tsx   # Character edit & soft-delete form component
└── character-profile-card.tsx# Showcase card for profiles & character views
```

## Architecture Principles

- **Unconstrained Foreign Keys**: `ownerUserId` is a plain `text` column with no database-level foreign key to
  `users.id`.
- **Port/Adapter Auth**: Consumes `CharacterAuthAdapter` defined locally in `src/contracts/auth.ts`.
- **Creation Limit**: Hard limit of 10 active characters per user account (`MAX_CHARACTERS_PER_USER`).
- **Audit Logging**: Logs all actions (`CHARACTER_CREATED`, `CHARACTER_EDITED`, `CHARACTER_DELETED`) to central host
  `audit_logs`.
