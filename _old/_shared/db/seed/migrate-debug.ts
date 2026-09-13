// scripts/migrate-debug.ts
import "dotenv/config";
import {drizzle} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import {Pool} from "pg";

async function main() {
    console.log("DATABASE_URL seen by process:", process.env.DATABASE_URL);

    const pool = new Pool({connectionString: process.env.DATABASE_URL});

    // Confirm exactly what this connection is actually pointed at
    const identity = await pool.query(
        "SELECT current_database() AS db, current_user AS usr, inet_server_addr() AS host, inet_server_port() AS port;"
    );
    console.log("Connected to:", identity.rows[0]);

    const db = drizzle(pool);

    try {
        await migrate(db, {migrationsFolder: "./drizzle"});
        console.log("Migrations applied successfully.");

        const tables = await pool.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
        );
        console.log("Tables now in public schema:", tables.rows.map(r => r.table_name));
    } catch (err) {
        console.error("Migration failed:");
        console.error(err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
