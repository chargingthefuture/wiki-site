import { queryDb } from '@/src/lib/db/postgres';

export async function getActiveUserIdsLastDays(days: number): Promise<string[]> {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 7;
  const result = await queryDb<{ user_id: string }>(
    `SELECT DISTINCT user_id
     FROM login_events
     WHERE created_at >= NOW() - ($1::text || ' days')::interval
     ORDER BY user_id ASC`,
    [safeDays],
  );

  return result.rows.map((row) => row.user_id);
}

export async function countActiveUsersLastDays(days: number): Promise<number> {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 7;
  const result = await queryDb<{ total: string }>(
    `SELECT COUNT(DISTINCT user_id)::text AS total
     FROM login_events
     WHERE created_at >= NOW() - ($1::text || ' days')::interval`,
    [safeDays],
  );

  return Number.parseInt(result.rows[0]?.total ?? '0', 10);
}
