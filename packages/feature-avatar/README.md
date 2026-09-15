# @app/feature-avatar

Isolated feature package for managing dynamic layered SVG avatars for Users and Characters.

## Package Structure

```
packages/feature-avatar/
├── package.json           # Scoped package definition
├── tsconfig.json          # Independent TypeScript configuration
└── src/
├── index.ts           # Barrel export entrypoint
├── assets/            # Modular SVG layer assets (base, eyes, hair, mouth)
├── contracts/
│   └── auth.ts        # Local AvatarAuthAdapter port contract
├── schema/
│   └── avatar.schema.ts  # Isolated Drizzle schema (polymorphic ownerId/ownerType)
├── lib/
│   ├── types.ts       # Layer config & state types
│   ├── options.ts     # Available asset options registry
│   ├── queries.ts     # Data retrieval queries
│   └── character-create-actions.ts     # Server actions (save/update avatar + audit logging)
└── components/
├── avatar-builder.tsx   # Interactive customization builder panel
├── avatar-provider.tsx  # Context provider for active selection state
└── avatar-renderer.tsx  # SVG layered composition engine
```

## Architecture Principles
- **Polymorphic Ownership**: Avatars belong to either a `USER` or a `CHARACTER` via `ownerType` and `ownerId`.
- **Unconstrained Foreign Keys**: `ownerId` is a plain `text` column with no database-level foreign key to `users` or `characters`.
- **Port/Adapter Auth**: Consumes `AvatarAuthAdapter` defined locally in `src/contracts/auth.ts`.
- **Preserved Engine**: SVG layer rendering and asset composition logic remains strictly untouched.
```
