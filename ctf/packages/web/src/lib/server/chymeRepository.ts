import type { ChymeChatMessage, ChymeParticipant, ChymeRoomState } from "@ctf/shared";
import { randomUUID } from "crypto";
import { getDbPool } from "./db";

const DEFAULT_ROOM_ID = "chyme-main-room";
const DEFAULT_ROOM_NAME = "Chyme Main Room";

export const ensureChymeRoom = async (): Promise<void> => {
  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO chyme_rooms (id, name, service_name, call_active)
      VALUES ($1, $2, 'chyme', true)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = NOW()
    `,
    [DEFAULT_ROOM_ID, DEFAULT_ROOM_NAME],
  );
};

export const upsertChymeProfileAndMember = async (input: {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role?: "speaker" | "listener";
}): Promise<void> => {
  await ensureChymeRoom();

  const pool = getDbPool();
  const role = input.role ?? "listener";

  await pool.query(
    `
      INSERT INTO chyme_service_profiles (user_id, status)
      VALUES ($1, 'active')
      ON CONFLICT (user_id) DO UPDATE SET
        status = 'active',
        deleted_at = NULL,
        updated_at = NOW()
    `,
    [input.userId],
  );

  await pool.query(
    `
      INSERT INTO chyme_room_members (room_id, user_id, display_name, avatar_url, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (room_id, user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url,
        role = EXCLUDED.role,
        last_seen_at = NOW()
    `,
    [DEFAULT_ROOM_ID, input.userId, input.displayName, input.avatarUrl ?? null, role],
  );
};

export const listChymeParticipants = async (): Promise<ChymeParticipant[]> => {
  const pool = getDbPool();
  const result = await pool.query<{
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    role: "speaker" | "listener";
  }>(
    `
      SELECT user_id, display_name, avatar_url, role
      FROM chyme_room_members
      WHERE room_id = $1
      ORDER BY role ASC, last_seen_at DESC
      LIMIT 60
    `,
    [DEFAULT_ROOM_ID],
  );

  return result.rows.map((row) => ({
    id: row.user_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? undefined,
    role: row.role,
  }));
};

export const getChymeRoomState = async (): Promise<ChymeRoomState> => {
  await ensureChymeRoom();

  const participants = await listChymeParticipants();

  return {
    roomId: DEFAULT_ROOM_ID,
    roomName: DEFAULT_ROOM_NAME,
    serviceName: "chyme",
    callActive: true,
    participants,
  };
};

export const listChymeMessages = async (): Promise<ChymeChatMessage[]> => {
  const pool = getDbPool();
  const result = await pool.query<{
    id: string;
    user_id: string;
    author_display_name: string;
    text: string;
    created_at: string;
  }>(
    `
      SELECT id, user_id, author_display_name, text, created_at
      FROM chyme_messages
      WHERE room_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `,
    [DEFAULT_ROOM_ID],
  );

  return result.rows
    .reverse()
    .map((row) => ({
      id: row.id,
      authorId: row.user_id,
      authorDisplayName: row.author_display_name,
      text: row.text,
      sentAtIso: new Date(row.created_at).toISOString(),
    }));
};

export const insertChymeMessage = async (input: {
  userId: string;
  authorDisplayName: string;
  text: string;
}): Promise<ChymeChatMessage> => {
  await ensureChymeRoom();

  const pool = getDbPool();
  const id = randomUUID();

  const result = await pool.query<{
    id: string;
    user_id: string;
    author_display_name: string;
    text: string;
    created_at: string;
  }>(
    `
      INSERT INTO chyme_messages (id, room_id, user_id, author_display_name, text)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, author_display_name, text, created_at
    `,
    [id, DEFAULT_ROOM_ID, input.userId, input.authorDisplayName, input.text],
  );

  const row = result.rows[0];
  return {
    id: row.id,
    authorId: row.user_id,
    authorDisplayName: row.author_display_name,
    text: row.text,
    sentAtIso: new Date(row.created_at).toISOString(),
  };
};

export const deleteChymeProfileData = async (userId: string): Promise<void> => {
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query(
      `
        UPDATE chyme_service_profiles
        SET status = 'deleted', deleted_at = NOW(), updated_at = NOW()
        WHERE user_id = $1
      `,
      [userId],
    );

    await pool.query(
      `
        DELETE FROM chyme_room_members
        WHERE room_id = $1 AND user_id = $2
      `,
      [DEFAULT_ROOM_ID, userId],
    );

    await pool.query(
      `
        DELETE FROM chyme_messages
        WHERE room_id = $1 AND user_id = $2
      `,
      [DEFAULT_ROOM_ID, userId],
    );

    await pool.query(
      `
        INSERT INTO chyme_deletion_events (user_id, scope, service_name)
        VALUES ($1, 'service', 'chyme')
      `,
      [userId],
    );

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

export const recordFullAccountDeletionRequest = async (userId: string): Promise<void> => {
  const pool = getDbPool();
  await pool.query(
    `
      INSERT INTO chyme_deletion_events (user_id, scope, service_name)
      VALUES ($1, 'account', NULL)
    `,
    [userId],
  );
};

export const chymeRoomId = DEFAULT_ROOM_ID;
