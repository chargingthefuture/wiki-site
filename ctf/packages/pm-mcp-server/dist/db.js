import pkg from 'pg';
const { Client } = pkg;
let client = null;
export async function initializeDb() {
    if (client)
        return;
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is required');
    }
    client = new Client({
        connectionString: databaseUrl,
    });
    try {
        await client.connect();
        console.error('[PM MCP] Connected to database');
    }
    catch (error) {
        console.error('[PM MCP] Database connection failed:', error);
        throw error;
    }
}
export function getClient() {
    if (!client) {
        throw new Error('Database not initialized. Call initializeDb() first.');
    }
    return client;
}
export async function closeDb() {
    if (client) {
        await client.end();
        client = null;
    }
}
export async function query(sql, params) {
    const c = getClient();
    return c.query(sql, params);
}
//# sourceMappingURL=db.js.map