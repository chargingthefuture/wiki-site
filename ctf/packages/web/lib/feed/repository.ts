import type { PoolClient } from 'pg';
import { queryDb, withDbTransaction } from '../lib/db/postgres';
import {
  FEED_DEFAULT_PAGE,
  FEED_DEFAULT_PAGE_SIZE,
  FEED_MAX_BODY_LENGTH,
  FEED_MAX_PAGE_SIZE,
  FEED_MAX_TITLE_LENGTH,
} from './constants';
import { emitFeedMembershipEventToStream } from './stream';
import type {
  Announcement,
  AnnouncementDraftInput,
  AnnouncementTargeting,
  FeedConfig,
  FeedConfigInput,
  FeedPagination,
  FeedTimelineItem,
  MembershipEventType,
} from './types';

type FeedConfigRow = {
  render_mode: 'card_only' | 'card_toast';
  kill_switch_enabled: boolean;
  max_timeline_page_size: number;
  updated_by_user_id: string;
  updated_at: Date;
};

type FeedTimelineRow = {
  id: string;
  item_type: 'announcement' | 'activity';
  source_announcement_id: string | null;
  title: string;
  body: string;
  priority: number;
  mandatory: boolean;
  published_at: Date;
  expires_at: Date | null;
  is_read: boolean;
  is_dismissed: boolean;
};

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  priority: number;
  mandatory: boolean;
  schedule_at: Date | null;
  published_at: Date | null;
  expires_at: Date | null;
  targeting: AnnouncementTargeting;
  created_by_user_id: string;
  updated_by_user_id: string;
  created_at: Date;
  updated_at: Date;
};

type CountRow = { total: string };

function toIso(value: Date): string {
  return value.toISOString();
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeNullableText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : null;
}

function isValidIsoDatetime(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return Array.from(new Set(normalized));
}

function normalizeTargeting(targeting: unknown): AnnouncementTargeting {
  if (!targeting || typeof targeting !== 'object') {
    return {};
  }

  const target = targeting as { roles?: unknown; plugins?: unknown; regions?: unknown };

  return {
    roles: normalizeStringArray(target.roles),
    plugins: normalizeStringArray(target.plugins),
    regions: normalizeStringArray(target.regions),
  };
}

function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    status: row.status,
    priority: row.priority,
    mandatory: row.mandatory,
    scheduleAtIso: row.schedule_at ? toIso(row.schedule_at) : null,
    publishedAtIso: row.published_at ? toIso(row.published_at) : null,
    expiresAtIso: row.expires_at ? toIso(row.expires_at) : null,
    targeting: normalizeTargeting(row.targeting),
    createdByUserId: row.created_by_user_id,
    updatedByUserId: row.updated_by_user_id,
    createdAtIso: toIso(row.created_at),
    updatedAtIso: toIso(row.updated_at),
  };
}

function mapFeedConfig(row: FeedConfigRow): FeedConfig {
  return {
    renderMode: row.render_mode,
    killSwitchEnabled: row.kill_switch_enabled,
    maxTimelinePageSize: row.max_timeline_page_size,
    updatedByUserId: row.updated_by_user_id,
    updatedAtIso: toIso(row.updated_at),
  };
}

export function parsePaginationParams(url: string): { page: number; pageSize: number } {
  const params = new URL(url).searchParams;
  const pageRaw = Number.parseInt(params.get('page') ?? '', 10);
  const pageSizeRaw = Number.parseInt(params.get('pageSize') ?? '', 10);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : FEED_DEFAULT_PAGE;
  const pageSizeBase = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? pageSizeRaw : FEED_DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(pageSizeBase, FEED_MAX_PAGE_SIZE);

  return { page, pageSize };
}

export function validateFeedConfigInput(input: FeedConfigInput): boolean {
  const renderModeAllowed = input.renderMode === 'card_only' || input.renderMode === 'card_toast';
  const maxPageSizeAllowed = Number.isInteger(input.maxTimelinePageSize)
    && input.maxTimelinePageSize >= 10
    && input.maxTimelinePageSize <= FEED_MAX_PAGE_SIZE;

  return renderModeAllowed && typeof input.killSwitchEnabled === 'boolean' && maxPageSizeAllowed;
}

export function validateAnnouncementDraftInput(input: AnnouncementDraftInput): boolean {
  const title = normalizeText(input.title ?? '');
  const body = normalizeText(input.body ?? '');
  const scheduleAt = normalizeNullableText(input.scheduleAtIso);
  const expiresAt = normalizeNullableText(input.expiresAtIso);

  const checks = [
    title.length > 0 && title.length <= FEED_MAX_TITLE_LENGTH,
    body.length > 0 && body.length <= FEED_MAX_BODY_LENGTH,
    input.priority === undefined || Number.isInteger(input.priority),
    input.mandatory === undefined || typeof input.mandatory === 'boolean',
    !scheduleAt || isValidIsoDatetime(scheduleAt),
    !expiresAt || isValidIsoDatetime(expiresAt),
  ];

  return checks.every(Boolean);
}

async function nextAnnouncementRevision(client: PoolClient, announcementId: string): Promise<number> {
  const result = await client.query<{ max_revision: number | null }>(
    `
      SELECT MAX(revision_number) AS max_revision
      FROM announcement_revisions
      WHERE announcement_id = $1::uuid
    `,
    [announcementId],
  );

  const maxRevision = result.rows[0]?.max_revision ?? 0;
  return maxRevision + 1;
}

async function upsertFeedTargetsForAnnouncement(
  client: PoolClient,
  feedItemId: string,
  targeting: AnnouncementTargeting,
): Promise<void> {
  await client.query('DELETE FROM feed_item_targets WHERE item_id = $1::uuid', [feedItemId]);

  const targetRoles = targeting.roles && targeting.roles.length > 0 ? targeting.roles : ['member'];
  const targetPlugins = targeting.plugins && targeting.plugins.length > 0 ? targeting.plugins : [null];
  const targetRegions = targeting.regions && targeting.regions.length > 0 ? targeting.regions : [null];

  for (const role of targetRoles) {
    for (const plugin of targetPlugins) {
      for (const region of targetRegions) {
        await client.query(
          `
            INSERT INTO feed_item_targets (item_id, target_role, target_plugin, target_region)
            VALUES ($1::uuid, $2, $3, $4)
            ON CONFLICT (item_id, target_role, target_plugin, target_region)
            DO NOTHING
          `,
          [feedItemId, role, plugin, region],
        );
      }
    }
  }
}

async function syncFeedItemForAnnouncement(
  client: PoolClient,
  actorId: string,
  announcement: Announcement,
): Promise<void> {
  if (announcement.status !== 'published') {
    await client.query(
      `
        UPDATE feed_items
        SET is_active = FALSE, updated_by_user_id = $2, updated_at = NOW()
        WHERE source_announcement_id = $1::uuid
      `,
      [announcement.id, actorId],
    );
    return;
  }

  const feedItemResult = await client.query<{ id: string }>(
    `
      INSERT INTO feed_items
        (item_type, source_announcement_id, title, body, priority, mandatory, published_at, expires_at, is_active, created_by_user_id, updated_by_user_id)
      VALUES
        ('announcement', $1::uuid, $2, $3, $4, $5, COALESCE($6::timestamptz, NOW()), $7::timestamptz, TRUE, $8, $8)
      ON CONFLICT (source_announcement_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        priority = EXCLUDED.priority,
        mandatory = EXCLUDED.mandatory,
        published_at = EXCLUDED.published_at,
        expires_at = EXCLUDED.expires_at,
        is_active = TRUE,
        updated_by_user_id = EXCLUDED.updated_by_user_id,
        updated_at = NOW()
      RETURNING id
    `,
    [
      announcement.id,
      announcement.title,
      announcement.body,
      announcement.priority,
      announcement.mandatory,
      announcement.publishedAtIso,
      announcement.expiresAtIso,
      actorId,
    ],
  );

  const feedItemId = feedItemResult.rows[0].id;
  await upsertFeedTargetsForAnnouncement(client, feedItemId, announcement.targeting);
}

export async function getFeedConfig(): Promise<FeedConfig> {
  const result = await queryDb<FeedConfigRow>(
    `
      SELECT render_mode, kill_switch_enabled, max_timeline_page_size, updated_by_user_id, updated_at
      FROM feed_render_config
      WHERE singleton_key = TRUE
      LIMIT 1
    `,
  );

  if (result.rows.length === 0) {
    throw new Error('feed_config_not_found');
  }

  return mapFeedConfig(result.rows[0]);
}

export async function updateFeedConfig(actorId: string, input: FeedConfigInput): Promise<FeedConfig> {
  const result = await queryDb<FeedConfigRow>(
    `
      UPDATE feed_render_config
      SET
        render_mode = $1,
        kill_switch_enabled = $2,
        max_timeline_page_size = $3,
        updated_by_user_id = $4,
        updated_at = NOW()
      WHERE singleton_key = TRUE
      RETURNING render_mode, kill_switch_enabled, max_timeline_page_size, updated_by_user_id, updated_at
    `,
    [input.renderMode, input.killSwitchEnabled, input.maxTimelinePageSize, actorId],
  );

  if (result.rows.length === 0) {
    throw new Error('feed_config_not_found');
  }

  return mapFeedConfig(result.rows[0]);
}

export async function listFeedTimeline(
  userId: string,
  role: string | null,
  pagination: { page: number; pageSize: number },
  filters: { pluginId?: string | null },
): Promise<{ items: FeedTimelineItem[]; pagination: FeedPagination }> {
  return withDbTransaction(async (client) => {
    const offset = (pagination.page - 1) * pagination.pageSize;
    const actorRole = role ?? 'member';
    const pluginFilter = normalizeNullableText(filters.pluginId);

    const count = await client.query<CountRow>(
      `
        SELECT COUNT(*)::text AS total
        FROM feed_timeline_projection f
        WHERE EXISTS (
          SELECT 1
          FROM feed_item_targets t
          WHERE t.item_id = f.id
            AND t.target_role IN ($1, 'member', 'all')
            AND ($2::text IS NULL OR t.target_plugin IS NULL OR t.target_plugin = $2)
        )
      `,
      [actorRole, pluginFilter],
    );

    const total = Number.parseInt(count.rows[0]?.total ?? '0', 10);

    const result = await client.query<FeedTimelineRow>(
      `
        SELECT
          f.id,
          f.item_type,
          f.source_announcement_id,
          f.title,
          f.body,
          f.priority,
          f.mandatory,
          f.published_at,
          f.expires_at,
          fr.user_id IS NOT NULL AS is_read,
          fd.user_id IS NOT NULL AS is_dismissed
        FROM feed_timeline_projection f
        LEFT JOIN feed_user_read_state fr
          ON fr.item_id = f.id AND fr.user_id = $3
        LEFT JOIN feed_user_dismissals fd
          ON fd.item_id = f.id AND fd.user_id = $3
        WHERE EXISTS (
          SELECT 1
          FROM feed_item_targets t
          WHERE t.item_id = f.id
            AND t.target_role IN ($1, 'member', 'all')
            AND ($2::text IS NULL OR t.target_plugin IS NULL OR t.target_plugin = $2)
        )
        ORDER BY f.priority DESC, f.published_at DESC, f.id DESC
        OFFSET $4 LIMIT $5
      `,
      [actorRole, pluginFilter, userId, offset, pagination.pageSize],
    );

    return {
      items: result.rows.map((row) => ({
        id: row.id,
        itemType: row.item_type,
        sourceAnnouncementId: row.source_announcement_id,
        title: row.title,
        body: row.body,
        priority: row.priority,
        mandatory: row.mandatory,
        publishedAtIso: toIso(row.published_at),
        expiresAtIso: row.expires_at ? toIso(row.expires_at) : null,
        isRead: row.is_read,
        isDismissed: row.is_dismissed,
      })),
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
      },
    };
  });
}

export async function markFeedItemRead(userId: string, itemId: string): Promise<void> {
  await queryDb(
    `
      INSERT INTO feed_user_read_state (user_id, item_id, read_at)
      VALUES ($1, $2::uuid, NOW())
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET read_at = EXCLUDED.read_at
    `,
    [userId, itemId],
  );
}

export async function dismissFeedItem(userId: string, itemId: string): Promise<'ok' | 'mandatory'> {
  const result = await queryDb<{ mandatory: boolean }>(
    'SELECT mandatory FROM feed_items WHERE id = $1::uuid LIMIT 1',
    [itemId],
  );

  if (result.rows.length === 0) {
    throw new Error('feed_item_not_found');
  }

  if (result.rows[0].mandatory) {
    return 'mandatory';
  }

  await queryDb(
    `
      INSERT INTO feed_user_dismissals (user_id, item_id, dismissed_at)
      VALUES ($1, $2::uuid, NOW())
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET dismissed_at = EXCLUDED.dismissed_at
    `,
    [userId, itemId],
  );

  return 'ok';
}

export async function listAnnouncements(includeArchived: boolean): Promise<Announcement[]> {
  const result = await queryDb<AnnouncementRow>(
    `
      SELECT
        id,
        title,
        body,
        status,
        priority,
        mandatory,
        schedule_at,
        published_at,
        expires_at,
        targeting,
        created_by_user_id,
        updated_by_user_id,
        created_at,
        updated_at
      FROM announcements
      WHERE ($1::boolean = TRUE OR status <> 'archived')
      ORDER BY created_at DESC
    `,
    [includeArchived],
  );

  return result.rows.map(mapAnnouncement);
}

export async function createAnnouncementDraft(actorId: string, input: AnnouncementDraftInput): Promise<Announcement> {
  return withDbTransaction(async (client) => {
    const title = normalizeText(input.title);
    const body = normalizeText(input.body);
    const priority = Number.isInteger(input.priority) ? Number(input.priority) : 0;
    const mandatory = Boolean(input.mandatory);
    const scheduleAtIso = normalizeNullableText(input.scheduleAtIso);
    const expiresAtIso = normalizeNullableText(input.expiresAtIso);
    const targeting = normalizeTargeting(input.targeting);

    const insert = await client.query<AnnouncementRow>(
      `
        INSERT INTO announcements
          (title, body, status, priority, mandatory, schedule_at, expires_at, targeting, created_by_user_id, updated_by_user_id)
        VALUES
          ($1, $2, 'draft', $3, $4, $5::timestamptz, $6::timestamptz, $7::jsonb, $8, $8)
        RETURNING
          id, title, body, status, priority, mandatory, schedule_at, published_at, expires_at, targeting,
          created_by_user_id, updated_by_user_id, created_at, updated_at
      `,
      [title, body, priority, mandatory, scheduleAtIso, expiresAtIso, JSON.stringify(targeting), actorId],
    );

    const announcement = mapAnnouncement(insert.rows[0]);
    await client.query(
      `
        INSERT INTO announcement_revisions
          (announcement_id, revision_number, title, body, targeting, created_by_user_id)
        VALUES
          ($1::uuid, 1, $2, $3, $4::jsonb, $5)
      `,
      [announcement.id, announcement.title, announcement.body, JSON.stringify(announcement.targeting), actorId],
    );

    return announcement;
  });
}

export async function updateAnnouncementDraft(actorId: string, announcementId: string, input: AnnouncementDraftInput): Promise<Announcement> {
  return withDbTransaction(async (client) => {
    const existing = await client.query<AnnouncementRow>(
      `
        SELECT
          id,
          title,
          body,
          status,
          priority,
          mandatory,
          schedule_at,
          published_at,
          expires_at,
          targeting,
          created_by_user_id,
          updated_by_user_id,
          created_at,
          updated_at
        FROM announcements
        WHERE id = $1::uuid
        LIMIT 1
      `,
      [announcementId],
    );

    if (existing.rows.length === 0) {
      throw new Error('announcement_not_found');
    }

    if (existing.rows[0].status !== 'draft') {
      throw new Error('announcement_not_draft');
    }

    const title = normalizeText(input.title);
    const body = normalizeText(input.body);
    const priority = Number.isInteger(input.priority) ? Number(input.priority) : existing.rows[0].priority;
    const mandatory = typeof input.mandatory === 'boolean' ? input.mandatory : existing.rows[0].mandatory;
    const scheduleAtIso = normalizeNullableText(input.scheduleAtIso);
    const expiresAtIso = normalizeNullableText(input.expiresAtIso);
    const targeting = normalizeTargeting(input.targeting);

    const update = await client.query<AnnouncementRow>(
      `
        UPDATE announcements
        SET
          title = $2,
          body = $3,
          priority = $4,
          mandatory = $5,
          schedule_at = $6::timestamptz,
          expires_at = $7::timestamptz,
          targeting = $8::jsonb,
          updated_by_user_id = $9,
          updated_at = NOW()
        WHERE id = $1::uuid
        RETURNING
          id, title, body, status, priority, mandatory, schedule_at, published_at, expires_at, targeting,
          created_by_user_id, updated_by_user_id, created_at, updated_at
      `,
      [announcementId, title, body, priority, mandatory, scheduleAtIso, expiresAtIso, JSON.stringify(targeting), actorId],
    );

    const revision = await nextAnnouncementRevision(client, announcementId);
    const announcement = mapAnnouncement(update.rows[0]);
    await client.query(
      `
        INSERT INTO announcement_revisions
          (announcement_id, revision_number, title, body, targeting, created_by_user_id)
        VALUES
          ($1::uuid, $2, $3, $4, $5::jsonb, $6)
      `,
      [announcement.id, revision, announcement.title, announcement.body, JSON.stringify(announcement.targeting), actorId],
    );

    return announcement;
  });
}

export async function publishAnnouncement(actorId: string, announcementId: string): Promise<Announcement> {
  return withDbTransaction(async (client) => {
    const update = await client.query<AnnouncementRow>(
      `
        UPDATE announcements
        SET
          status = 'published',
          published_at = COALESCE(schedule_at, NOW()),
          updated_by_user_id = $2,
          updated_at = NOW()
        WHERE id = $1::uuid
        RETURNING
          id, title, body, status, priority, mandatory, schedule_at, published_at, expires_at, targeting,
          created_by_user_id, updated_by_user_id, created_at, updated_at
      `,
      [announcementId, actorId],
    );

    if (update.rows.length === 0) {
      throw new Error('announcement_not_found');
    }

    const announcement = mapAnnouncement(update.rows[0]);
    await client.query(
      `
        INSERT INTO announcement_delivery_events (announcement_id, event_type, payload, created_by_user_id)
        VALUES ($1::uuid, 'published', $2::jsonb, $3)
      `,
      [announcement.id, JSON.stringify({ status: announcement.status, publishedAt: announcement.publishedAtIso }), actorId],
    );

    await syncFeedItemForAnnouncement(client, actorId, announcement);
    return announcement;
  });
}

export async function archiveAnnouncement(actorId: string, announcementId: string): Promise<Announcement> {
  return withDbTransaction(async (client) => {
    const update = await client.query<AnnouncementRow>(
      `
        UPDATE announcements
        SET
          status = 'archived',
          updated_by_user_id = $2,
          updated_at = NOW()
        WHERE id = $1::uuid
        RETURNING
          id, title, body, status, priority, mandatory, schedule_at, published_at, expires_at, targeting,
          created_by_user_id, updated_by_user_id, created_at, updated_at
      `,
      [announcementId, actorId],
    );

    if (update.rows.length === 0) {
      throw new Error('announcement_not_found');
    }

    const announcement = mapAnnouncement(update.rows[0]);
    await client.query(
      `
        INSERT INTO announcement_delivery_events (announcement_id, event_type, payload, created_by_user_id)
        VALUES ($1::uuid, 'archived', $2::jsonb, $3)
      `,
      [announcement.id, JSON.stringify({ status: announcement.status }), actorId],
    );

    await syncFeedItemForAnnouncement(client, actorId, announcement);
    return announcement;
  });
}

export async function markAnnouncementRead(userId: string, announcementId: string): Promise<void> {
  await queryDb(
    `
      INSERT INTO announcement_user_state (user_id, announcement_id, read_at, acknowledged_at, updated_at)
      VALUES ($1, $2::uuid, NOW(), NOW(), NOW())
      ON CONFLICT (user_id, announcement_id)
      DO UPDATE SET read_at = NOW(), acknowledged_at = NOW(), updated_at = NOW()
    `,
    [userId, announcementId],
  );
}

export async function dismissAnnouncement(userId: string, announcementId: string): Promise<'ok' | 'mandatory'> {
  const result = await queryDb<{ mandatory: boolean }>(
    'SELECT mandatory FROM announcements WHERE id = $1::uuid LIMIT 1',
    [announcementId],
  );

  if (result.rows.length === 0) {
    throw new Error('announcement_not_found');
  }

  if (result.rows[0].mandatory) {
    return 'mandatory';
  }

  await queryDb(
    `
      INSERT INTO announcement_user_state (user_id, announcement_id, dismissed_at, updated_at)
      VALUES ($1, $2::uuid, NOW(), NOW())
      ON CONFLICT (user_id, announcement_id)
      DO UPDATE SET dismissed_at = NOW(), updated_at = NOW()
    `,
    [userId, announcementId],
  );

  return 'ok';
}

export function validateAnnouncementTargeting(targeting: unknown): { ok: boolean; normalized: AnnouncementTargeting } {
  const normalized = normalizeTargeting(targeting);
  const hasInvalidRole = (normalized.roles ?? []).some((role) => !['member', 'admin', 'all'].includes(role));

  if (hasInvalidRole) {
    return { ok: false, normalized };
  }

  return { ok: true, normalized };
}

export async function emitMembershipEvent(input: {
  actorId: string;
  userId: string;
  pluginId: string;
  eventType: MembershipEventType;
  requestId: string | null;
  traceId: string | null;
}): Promise<{ streamEmitted: boolean }> {
  await withDbTransaction(async (client) => {
    await client.query(
      `
        INSERT INTO feed_membership_events (actor_id, user_id, plugin_id, event_type, request_id, trace_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [input.actorId, input.userId, input.pluginId, input.eventType, input.requestId, input.traceId],
    );

    await client.query(
      `
        INSERT INTO announcement_membership_events (actor_id, user_id, plugin_id, event_type, request_id, trace_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [input.actorId, input.userId, input.pluginId, input.eventType, input.requestId, input.traceId],
    );

    await client.query(
      `
        INSERT INTO announcement_delivery_events (announcement_id, event_type, payload, created_by_user_id)
        SELECT id, 'membership_recalc', $1::jsonb, $2
        FROM announcements
        WHERE status = 'published'
      `,
      [JSON.stringify({ userId: input.userId, pluginId: input.pluginId, eventType: input.eventType }), input.actorId],
    );
  });

  const streamEmitted = await emitFeedMembershipEventToStream(input);
  return { streamEmitted };
}
