import type { SkillsHuntNotification } from "@ctf/shared";
import { randomUUID } from "crypto";
import { getDbPool } from "../db";

interface NotificationRow {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

const mapNotification = (row: NotificationRow): SkillsHuntNotification => ({
  id: row.id,
  userId: row.user_id,
  notificationType: row.notification_type,
  title: row.title,
  message: row.message,
  payload: row.payload,
  isRead: row.is_read,
  readAtIso: row.read_at ? new Date(row.read_at).toISOString() : null,
  createdAtIso: new Date(row.created_at).toISOString(),
});

export const insertNotification = async (input: {
  userId: string;
  notificationType: string;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}): Promise<SkillsHuntNotification> => {
  const id = randomUUID();
  const pool = getDbPool();
  const result = await pool.query<NotificationRow>(
    `
      INSERT INTO skills_hunt_notifications (
        id,
        user_id,
        notification_type,
        title,
        message,
        payload
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING
        id,
        user_id,
        notification_type,
        title,
        message,
        payload,
        is_read,
        read_at,
        created_at
    `,
    [id, input.userId, input.notificationType, input.title, input.message, JSON.stringify(input.payload ?? {})],
  );

  return mapNotification(result.rows[0]);
};

export const listNotificationsByUser = async (userId: string): Promise<SkillsHuntNotification[]> => {
  const pool = getDbPool();
  const result = await pool.query<NotificationRow>(
    `
      SELECT
        id,
        user_id,
        notification_type,
        title,
        message,
        payload,
        is_read,
        read_at,
        created_at
      FROM skills_hunt_notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `,
    [userId],
  );

  return result.rows.map(mapNotification);
};

export const markNotificationAsRead = async (input: {
  notificationId: string;
  userId: string;
}): Promise<SkillsHuntNotification | null> => {
  const pool = getDbPool();
  const result = await pool.query<NotificationRow>(
    `
      UPDATE skills_hunt_notifications
      SET is_read = TRUE,
          read_at = NOW()
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        user_id,
        notification_type,
        title,
        message,
        payload,
        is_read,
        read_at,
        created_at
    `,
    [input.notificationId, input.userId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapNotification(result.rows[0]);
};
