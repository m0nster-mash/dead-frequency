# Code Standards &amp; AI Constraints

- **CSS Standard**: NEVER use inline styles (`style={{ ... }}`). Always import and apply CSS Modules from
  `@/shared/styles/`.
- **Next.js Version**: Follow Next.js 15 conventions (e.g., `await params`).
- **Database**: Drizzle ORM queries return arrays; use array destructuring (`const [row] = await db.select()...`).
- **Existing Structures**: Before updating a page, examine the state of the existing page. Examine any structures that
  already exist in the project. Reuse existing objects, do not create new objects unless nothing exists already.
