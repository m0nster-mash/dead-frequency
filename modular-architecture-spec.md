# Dead Frequency: Pluggable Modular Architecture Specification & AI Guidance

## Executive Summary & Core Vision
The goal of the **Dead Frequency** project refactoring is to transition from a monolithic Next.js application into a **Pluggable Module-Host Architecture**.

In this system:
1. **Host Application (`dead-frequency`)**: Serves as the central shell/host providing core layouts, authentication providers, user management, app shell frames, and a dynamic module registry.
2. **Independent Feature Modules (`@dead-frequency/chatbox`, `@dead-frequency/avatar`, `@dead-frequency/forum`, etc.)**: Completely decoupled, publish-ready modules that can live in their own standalone git repositories (or local directories), be imported into any host application, and be toggled on or off seamlessly.
3. **Shared Core Libraries (`@dead-frequency/core`, `@dead-frequency/shared`)**: Shared UI primitives, base components, and contract definitions.

---

## Local Development vs. Publish-Ready Distribution

> **Key Rule**: Developers do **NOT** need to publish packages to NPM or external registries during development. The entire codebase can be developed locally (or in a local monorepo/pnpm workspace), but MUST be authored so that publishing to NPM or importing via Git requires **zero structural code changes**.

### 1. Local Linking Mechanisms (Development Mode)
- **Monorepo / Workspace Linking**: Using `pnpm` workspaces or npm/yarn workspaces, `dead-frequency` references local feature directories directly via package names (`"@dead-frequency/chatbox": "workspace:*"`).
- **Package Linking (`npm link` / `pnpm link`)**: For multi-repo setups on a local filesystem, `pnpm link --global` allows instant hot-reloading across separate git folders without pushing or building remote packages.
- **Local Path Dependencies**: Using `"file:../dead-chatbox"` in `package.json` for lightweight local integration.

### 2. Standards for "Publish Readiness"
Even when developing 100% locally, all feature modules MUST adhere to these packaging rules:
- **Clean Package Entrypoints**: Every module contains a `package.json` defining valid `main`, `module`, `types`, and `exports` fields targeting built outputs (e.g., `dist/`).
- **Bundling / Transpilation Setup**: Modules include a build pipeline (e.g., `tsup` or `vite`) to generate standalone `.js` bundles and `.d.ts` TypeScript declaration files.
- **Strict Import Boundary**: A module MUST NEVER reach outside its root folder or use host relative paths like `../../apps/web` or `@/core`. All host interaction occurs strictly via injected contracts/adapters.
- **Remote Git Compatibility**: When ready, the host can switch from local linking to a direct git repository URL (`"git+https://github.com/...#v1.0.0"`) or an NPM release without changing any runtime code in either the host or the module.

---

## Architectural Principles & Hard Constraints

Future AI assistants working on this repository **MUST** adhere to the following principles:

### 1. Inversion of Control (IoC) & Adapter Pattern
- **Rule**: Feature modules MUST NEVER directly import files or components from the host project (`apps/web` or `src/_core`, etc.).
- **Implementation**: Modules define TypeScript interface contracts (e.g., `ChatboxAuthAdapter`, `ModuleUser`) for the capabilities they require.
- **Host Responsibility**: The Host application implements these adapters and passes them into the module via React Context Providers or props.

### 2. Database Schema Decoupling
- **Rule**: Modules MUST NOT declare hard foreign key constraints (`references(() => users.id)`) to a host database table.
- **Implementation**: Modules store `userId` or `authorId` as generic string columns. Each module exports its own schema tables independently (e.g., `export * from './schema/chatbox.schema'`).
- **Host Responsibility**: The Host app aggregates schemas dynamically into Drizzle (or ORM client):
  ```typescript
  import * as chatboxSchema from "@dead-frequency/chatbox/schema";
  import * as avatarSchema from "@dead-frequency/avatar/schema";
  
  export const schema = { ...coreSchema, ...chatboxSchema, ...avatarSchema };
  ```

### 3. Decoupled Communication & Event Bus
- **Rule**: Modules MUST NOT directly invoke shared notification or moderation routines from other modules.
- **Implementation**: Modules publish events over an Event Bus (e.g., `eventBus.emit("chatbox:message_sent", payload)`).
- **Host Responsibility**: Host application registers event handlers to bridge notifications, moderation audit logs, or analytics.

### 4. Dynamic Feature Toggling & Module Registry
- **Rule**: Enabling or disabling a module should require zero modifications to module internal code.
- **Implementation**: Host application maintains a centralized `modules.config.ts` registry. Sidebars, headers, and routing dynamically render or return 404 based on registry state.

---

## Target Directory Layout (Monorepo Workspace or Linked Local Repos)

```
dead-frequency/
├── packages/
│   ├── core/                        # @dead-frequency/core
│   │   ├── src/
│   │   │   ├── auth/                # Auth contracts & provider types
│   │   │   ├── shell/               # AppShell, Sidebar, Header layout frames
│   │   │   ├── registry/            # Module loader context & types
│   │   │   └── ui/                  # Shared UI primitives (Button, Modal, Card)
│   │   └── package.json
│   │
│   ├── feature-chatbox/             # @dead-frequency/chatbox (Local Package or Standalone Repo)
│   │   ├── src/
│   │   │   ├── components/          # <ChatboxPanel />, <ChatboxWidget />
│   │   │   ├── contracts/           # ChatboxAuthAdapter, ChatboxUserContract
│   │   │   ├── lib/                 # Actions, queries, state hooks
│   │   │   └── schema/              # chatbox.schema.ts
│   │   ├── tsconfig.json
│   │   └── package.json             # Includes exports, scripts (build: tsup)
│   │
│   ├── feature-avatar/              # @dead-frequency/avatar
│   └── feature-forum/               # @dead-frequency/forum
│
└── apps/
    └── web/                         # Host Runner Application (Next.js)
        ├── src/
        │   ├── app/                 # Next.js App Router routes binding to modules
        │   ├── adapters/            # Host implementation of Module Adapters
        │   ├── config/              # modules.config.ts (Enabled module registry)
        │   └── db/                  # Aggregated Drizzle client & combined schema
        └── package.json             # Dependencies include "@dead-frequency/chatbox": "workspace:*"
```

---

## Adapter Implementation Example (For AI Reference)

### Module Interface Contract (`packages/feature-chatbox/src/contracts/auth.ts`)
```typescript
export interface ModuleUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ChatboxAuthAdapter {
  getCurrentUser(): Promise<ModuleUser | null>;
  canPostMessage(user: ModuleUser): Promise<boolean>;
}
```

### Module React Provider (`packages/feature-chatbox/src/components/chatbox-provider.tsx`)
```tsx
import React, { createContext, useContext } from 'react';
import { ChatboxAuthAdapter } from '../contracts/auth';

const ChatboxContext = createContext<{ authAdapter: ChatboxAuthAdapter } | null>(null);

export const ChatboxProvider: React.FC<{
  authAdapter: ChatboxAuthAdapter;
  children: React.ReactNode;
}> = ({ authAdapter, children }) => (
  <ChatboxContext.Provider value={{ authAdapter }}>
    {children}
  </ChatboxContext.Provider>
);
```

### Host App Adapter Injection (`apps/web/src/app/chatbox/page.tsx`)
```tsx
import { ChatboxProvider, ChatboxPanel } from '@dead-frequency/chatbox';
import { hostAuthAdapter } from '@/adapters/host-auth-adapter';

export default function ChatboxPage() {
  return (
    <ChatboxProvider authAdapter={hostAuthAdapter}>
      <ChatboxPanel />
    </ChatboxProvider>
  );
}
```

---

## Roadmap & Migration Action Plan

1. **Phase 1: Package Core Foundations**
   - Extract shared UI elements and App Shell layout components into `@dead-frequency/core`.
   - Establish unified TypeScript interfaces for Auth and User profile adapters.

2. **Phase 2: Decouple `feature-chatbox` (Local First)**
   - Isolate `chatbox.schema.ts` to omit external table references.
   - Refactor chatbox components to use `ChatboxAuthAdapter`.
   - Configure local package exports (`package.json`) and test via local workspace link.
   - Verify zero direct imports exist from `@/shared` or `@/core`.

3. **Phase 3: Decouple `feature-avatar` and `feature-forum`**
   - Replicate the adapter & isolated schema pattern across remaining features.

4. **Phase 4: Optional Multi-Repo / Registry Distribution**
   - Push completed local packages to standalone Git repositories or NPM registries as needed.

---

## Instructions for Future AI Assistants
When asked to implement new features or refactor existing code in this project:
- **DEVELOP LOCAL, AUTHOR FOR PUBLISH**: Allow local workspace references (`workspace:*` or linked paths), but ensure module code remains 100% decoupled and publish-ready.
- **ALWAYS** check if an operation creates a tight coupling between a module and the host. If it does, refactor to an Adapter or Event.
- **NEVER** add cross-module direct imports.
- **ALWAYS** write schemas in modular chunks so host applications can merge them on demand.
