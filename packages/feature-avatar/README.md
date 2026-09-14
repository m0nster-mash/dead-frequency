```
packages/feature-avatar/
├── package.json           # (NEW) Standalone module package config
├── tsconfig.json           # (NEW) Module TS configuration
└── src/
    ├── index.ts           # (MOVE from src/feature/avatar/index.ts)
    ├── assets/
    │   ├── base/
    │   │   └── base_1.svg           # (MOVE from src/feature/avatar/assets/base/)
    │   ├── eyes/
    │   │   ├── eyes_1.svg           # (MOVE from src/feature/avatar/assets/eyes/)
    │   │   └── eyes_2.svg           # (MOVE from src/feature/avatar/assets/eyes/)
    │   ├── hair/
    │   │   ├── hair_1.svg           # (MOVE from src/feature/avatar/assets/hair/)
    │   │   └── hair_2.svg           # (MOVE from src/feature/avatar/assets/hair/)
    │   └── mouth/
    │       ├── mouth_1.svg           # (MOVE from src/feature/avatar/assets/mouth/)
    │       └── mouth_2.svg           # (MOVE from src/feature/avatar/assets/mouth/)
    ├── components/
    │   ├── avatar-builder.tsx           # (MOVE from src/feature/avatar/components/)
    │   └── avatar-renderer.tsx           # (MOVE from src/feature/avatar/components/)
    ├── contracts/
    │   └── auth.ts           # (NEW) Decoupled user/auth interface contract
    ├── lib/
    │   ├── actions.ts           # (MOVE from src/feature/avatar/lib/)
    │   ├── options.ts           # (MOVE from src/feature/avatar/lib/)
    │   ├── types.ts           # (MOVE from src/feature/avatar/lib/)
    │   └── validation.ts           # (MOVE from src/feature/avatar/lib/)
    └── schema/
        └── avatar.schema.ts           # (MOVE from src/feature/avatar/schema/)
```
