```
packages/feature-forum/
├── package.json           # (NEW) Standalone module package config
├── tsconfig.json           # (NEW) Module TS configuration
└── src/
    ├── index.ts           # (NEW) Public API export entrypoint
    ├── components/
    │   ├── board-display.tsx           # (MOVE from src/feature/forum/components/)
    │   ├── create-post-panel.tsx           # (MOVE from src/feature/forum/components/)
    │   ├── create-reply-panel.tsx           # (MOVE from src/feature/forum/components/)
    │   ├── forum-stats-panel.tsx           # (MOVE from src/feature/forum/components/)
    │   ├── post-content-area.tsx           # (MOVE from src/feature/forum/components/)
    │   └── admin/
    │       ├── admin-forum-controls.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── admin-thread-controls.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── create-board-panel.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── create-category-panel.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── edit-board-panel.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── edit-category-panel.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── thread-admin-button.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── unassigned-boards.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       ├── view-category-content.tsx           # (MOVE from src/feature/forum/components/admin/)
    │       └── view-forum-panel.tsx           # (MOVE from src/feature/forum/components/admin/)
    ├── contracts/
    │   └── auth.ts           # (NEW) Decoupled user/auth interface contract
    ├── lib/
    │   ├── actions.ts           # (MOVE from src/feature/forum/lib/)
    │   └── queries.ts           # (MOVE from src/feature/forum/lib/)
    ├── schema/
    │   └── forum.schema.ts           # (MOVE from src/feature/forum/schema/)
    └── styles/
        ├── admin.module.css           # (MOVE from src/feature/forum/styles/)
        └── forum.module.css           # (MOVE from src/feature/forum/styles/)
```
