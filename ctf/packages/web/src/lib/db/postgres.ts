import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

let pool: Pool | null = null;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.trim().length === 0) {
    throw new Error('DATABASE_URL is required for Chyme persistence routes.');
  }

  return databaseUrl;
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return pool;
}

export async function queryDb<T extends QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, values as unknown[]);
}

export async function withDbTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const dbPool = getPool();
  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
