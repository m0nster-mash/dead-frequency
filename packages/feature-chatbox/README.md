```
packages/feature-chatbox/
├── package.json           # (NEW) Standalone module package config
├── tsconfig.json           # (NEW) Module TS configuration
└── src/
    ├── index.ts           # (NEW) Public API export entrypoint
    ├── components/
    │   ├── chatbox-dropdown.tsx           # (MOVE from src/feature/chatbox/components/)
    │   ├── chatbox-input.tsx           # (MOVE from src/feature/chatbox/components/)
    │   ├── chatbox-message.tsx           # (MOVE from src/feature/chatbox/components/)
    │   └── chatbox-panel.tsx           # (MOVE from src/feature/chatbox/components/)
    ├── contracts/
    │   └── auth.ts           # (NEW) Decoupled user/auth interface contract
    ├── lib/
    │   ├── character-create-actions.ts           # (MOVE from src/feature/chatbox/lib/)
    │   └── queries.ts           # (MOVE from src/feature/chatbox/lib/)
    ├── schema/
    │   └── chatbox.schema.ts           # (MOVE from src/feature/chatbox/schema/)
    └── styles/
        └── chatbox.module.css           # (MOVE from src/feature/chatbox/styles/)
```
