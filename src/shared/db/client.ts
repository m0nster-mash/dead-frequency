import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import * as schema from "@/shared/db/schema";

/**
 * Cast type overlay capturing the global runtime object space container.
 * Extended to house persistent database connection pools to mitigate socket leak bugs.
 */
const globalForDb = globalThis as typeof globalThis & {
    pool: Pool | undefined;
};

/**
 * High-performance PostgreSQL client connection manager pool.
 * Lazy-initializes single instance paths matching active global objects if pre-instantiated.
 */
const pool = globalForDb.pool || new Pool({
    connectionString: process.env.DATABASE_URL
});

/*
   Singleton Cache Safeguard Hook:
   During local development cycles, Next.js implements aggressive hot-module replacement (HMR)
   re-compiling code blocks on every document save. Binding active server connection references
   directly to the global execution scope blocks the server from spinning up redundant active
   socket channels and crashing database engine maximum connection capacities.
*/
if (process.env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
}

/**
 * The system-wide central database client interface instance.
 * Combines node-postgres driver instances with unified schema files to export type-safe Drizzle ORM query engines.
 *
 * @type {ReturnType<typeof drizzle>}
 */
export const db = drizzle({client: pool, schema});
