import type { PoolClient } from 'pg';
import {
  CHYME_DEFAULT_MESSAGES_LIMIT,
  CHYME_MAIN_ROOM_KEY,
  CHYME_MAIN_ROOM_NAME,
  CHYME_MAX_MESSAGE_LENGTH,
} from './constants';
import type {
  ChymeDeletionResponse,
  ChymeMessage,
  ChymeParticipant,
  ChymeRoomResponse,
} from './types';
import { queryDb, withDbTransaction } from '@/src/lib/db/postgres';

type IdentityInput = {
  userId: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
};

type RoomRow = {
  id: string;
  room_key: string;
  room_name: string;
  call_active: boolean;
};

type ParticipantRow = {
  user_id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  role: 'speaker' | 'listener';
  joined_at: Date;
  last_seen_at: Date;
};

type MessageRow = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  text: string;
  sent_at: Date;
};

function normalizeDisplayName(username: string | null, userId: string): string {
  if (username) {
    return `@${username}`;
  }

  return `user-${userId.slice(0, 8)}`;
}

function mapParticipant(row: ParticipantRow): ChymeParticipant {
  return {
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    joinedAtIso: row.joined_at.toISOString(),
    lastSeenAtIso: row.last_seen_at.toISOString(),
  };
}

function mapMessage(row: MessageRow): ChymeMessage {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    text: row.text,
    sentAtIso: row.sent_at.toISOString(),
  };
}

function sanitizeMessageText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

async function ensureMainRoom(client: PoolClient): Promise<RoomRow> {
  const inserted = await client.query<RoomRow>(
    `
      INSERT INTO chyme_rooms (room_key, room_name, call_active)
      VALUES ($1, $2, false)
      ON CONFLICT (room_key)
      DO UPDATE SET room_name = EXCLUDED.room_name
      RETURNING id, room_key, room_name, call_active
    `,
    [CHYME_MAIN_ROOM_KEY, CHYME_MAIN_ROOM_NAME],
  );

  return inserted.rows[0];
}

async function setRoomCallActive(
  client: PoolClient,
  roomId: string,
  callActive: boolean,
): Promise<RoomRow> {
  const updatedRoom = await client.query<RoomRow>(
    `
      UPDATE chyme_rooms
      SET call_active = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, room_key, room_name, call_active
    `,
    [roomId, callActive],
  );

  return updatedRoom.rows[0];
}

async function ensureServiceProfile(client: PoolClient, identity: IdentityInput): Promise<void> {
  await client.query(
    `
      INSERT INTO chyme_service_profiles (user_id, status, created_at, updated_at, deleted_at)
      VALUES ($1, 'active', NOW(), NOW(), NULL)
      ON CONFLICT (user_id)
      DO UPDATE SET status = 'active', updated_at = NOW(), deleted_at = NULL
    `,
    [identity.userId],
  );
}

async function upsertMember(client: PoolClient, roomId: string, identity: IdentityInput): Promise<void> {
  const displayName = identity.displayName || normalizeDisplayName(identity.username, identity.userId);

  await client.query(
    `
      INSERT INTO chyme_room_members (
        room_id,
        user_id,
        username,
        display_name,
        avatar_url,
        role,
        joined_at,
        last_seen_at
      )
      VALUES ($1, $2, $3, $4, $5, 'listener', NOW(), NOW())
      ON CONFLICT (room_id, user_id)
      DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url,
        last_seen_at = NOW()
    `,
    [roomId, identity.userId, identity.username, displayName, identity.avatarUrl],
  );
}

async function listRoomParticipants(client: PoolClient, roomId: string): Promise<ChymeParticipant[]> {
  const result = await client.query<ParticipantRow>(
    `
      SELECT
        user_id,
        username,
        display_name,
        avatar_url,
        role,
        joined_at,
        last_seen_at
      FROM chyme_room_members
      WHERE room_id = $1
      ORDER BY joined_at ASC
    `,
    [roomId],
  );

  return result.rows.map(mapParticipant);
}

export async function getRoomState(identity: IdentityInput): Promise<ChymeRoomResponse> {
  return withDbTransaction(async (client) => {
    const room = await ensureMainRoom(client);
    await ensureServiceProfile(client, identity);
    await upsertMember(client, room.id, identity);
    const participants = await listRoomParticipants(client, room.id);

    return {
      roomId: room.id,
      roomName: room.room_name,
      roomKey: room.room_key,
      callActive: room.call_active,
      participants,
    };
  });
}

export async function listRoomMessages(identity: IdentityInput, limit = CHYME_DEFAULT_MESSAGES_LIMIT): Promise<ChymeMessage[]> {
  return withDbTransaction(async (client) => {
    const room = await ensureMainRoom(client);
    await ensureServiceProfile(client, identity);
    await upsertMember(client, room.id, identity);

    const boundedLimit = Math.min(Math.max(limit, 1), CHYME_DEFAULT_MESSAGES_LIMIT);
    const result = await client.query<MessageRow>(
      `
        SELECT id, user_id, username, display_name, avatar_url, text, sent_at
        FROM chyme_messages
        WHERE room_id = $1
        ORDER BY sent_at DESC
        LIMIT $2
      `,
      [room.id, boundedLimit],
    );

    return result.rows.reverse().map(mapMessage);
  });
}

export function validateMessageInput(text: string): { valid: true; normalizedText: string } | { valid: false } {
  const normalizedText = sanitizeMessageText(text);
  if (normalizedText.length === 0 || normalizedText.length > CHYME_MAX_MESSAGE_LENGTH) {
    return { valid: false };
  }

  return {
    valid: true,
    normalizedText,
  };
}

export async function sendRoomMessage(identity: IdentityInput, text: string): Promise<ChymeMessage> {
  const validation = validateMessageInput(text);
  if (!validation.valid) {
    throw new Error('invalid_message_text');
  }

  return withDbTransaction(async (client) => {
    const room = await ensureMainRoom(client);
    await ensureServiceProfile(client, identity);
    await upsertMember(client, room.id, identity);

    const inserted = await client.query<MessageRow>(
      `
        INSERT INTO chyme_messages (
          room_id,
          user_id,
          username,
          display_name,
          avatar_url,
          text,
          sent_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, user_id, username, display_name, avatar_url, text, sent_at
      `,
      [
        room.id,
        identity.userId,
        identity.username,
        identity.displayName || normalizeDisplayName(identity.username, identity.userId),
        identity.avatarUrl,
        validation.normalizedText,
      ],
    );

    return mapMessage(inserted.rows[0]);
  });
}

export async function markRoomCallJoined(
  identity: IdentityInput,
): Promise<ChymeRoomResponse> {
  return withDbTransaction(async (client) => {
    const room = await ensureMainRoom(client);
    await ensureServiceProfile(client, identity);
    await upsertMember(client, room.id, identity);
    const activeRoom = await setRoomCallActive(client, room.id, true);
    const participants = await listRoomParticipants(client, room.id);

    return {
      roomId: activeRoom.id,
      roomName: activeRoom.room_name,
      roomKey: activeRoom.room_key,
      callActive: activeRoom.call_active,
      participants,
    };
  });
}

export async function markServiceDeletion(userId: string): Promise<ChymeDeletionResponse> {
  const requestedAtIso = await withDbTransaction(async (client) => {
    const roomResult = await client.query<RoomRow>(
      `SELECT id, room_key, room_name, call_active FROM chyme_rooms WHERE room_key = $1`,
      [CHYME_MAIN_ROOM_KEY],
    );

    const roomId = roomResult.rows[0]?.id;

    await client.query(
      `
        UPDATE chyme_service_profiles
        SET status = 'deleted', updated_at = NOW(), deleted_at = NOW()
        WHERE user_id = $1
      `,
      [userId],
    );

    if (roomId) {
      await client.query(`DELETE FROM chyme_messages WHERE room_id = $1 AND user_id = $2`, [roomId, userId]);
      await client.query(`DELETE FROM chyme_room_members WHERE room_id = $1 AND user_id = $2`, [roomId, userId]);
    }

    const inserted = await client.query<{ requested_at: Date }>(
      `
        INSERT INTO chyme_deletion_events (user_id, scope, service_name, requested_at, status)
        VALUES ($1, 'service', 'chyme', NOW(), 'completed')
        RETURNING requested_at
      `,
      [userId],
    );

    return inserted.rows[0].requested_at.toISOString();
  });

  return {
    ok: true,
    scope: 'service',
    status: 'completed',
    requestedAtIso,
  };
}

export async function markFullAccountDeletionRequested(userId: string): Promise<ChymeDeletionResponse> {
  const result = await queryDb<{ requested_at: Date }>(
    `
      INSERT INTO chyme_deletion_events (user_id, scope, service_name, requested_at, status)
      VALUES ($1, 'account', 'all-services', NOW(), 'requested')
      RETURNING requested_at
    `,
    [userId],
  );

  return {
    ok: true,
    scope: 'account',
    status: 'requested',
    requestedAtIso: result.rows[0].requested_at.toISOString(),
  };
}
