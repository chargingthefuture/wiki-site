import { randomUUID } from 'crypto';
import { queryDb } from '@/src/lib/db/postgres';

type WeekRow = {
  week_start_date: string;
  week_end_date: string;
  status: 'open' | 'locked' | 'published';
};

function mapWeek(row: WeekRow) {
  return {
    weekStartDate: row.week_start_date,
    weekEndDate: row.week_end_date,
    status: row.status,
  };
}

type MetricRow = {
  metric_key: string;
  metric_value: string;
  metric_unit: string;
  source_plugin: string;
};

function mapMetric(row: MetricRow) {
  return {
    metricKey: row.metric_key,
    metricValue: Number(row.metric_value),
    metricUnit: row.metric_unit,
    sourcePlugin: row.source_plugin,
  };
}

export async function listWeeks() {
  const result = await queryDb<WeekRow>(
    `SELECT week_start_date::text, week_end_date::text, status
     FROM weekly_performance_weeks
     ORDER BY week_start_date DESC
     LIMIT 52`,
  );

  return result.rows.map(mapWeek);
}

export async function selectWeek(input: { actorId: string; weekStartDate: string }) {
  const result = await queryDb<WeekRow>(
    `UPDATE weekly_performance_weeks
     SET selected_by_user_id = $1, selected_at = NOW(), updated_at = NOW()
     WHERE week_start_date = $2
     RETURNING week_start_date::text, week_end_date::text, status`,
    [input.actorId, input.weekStartDate],
  );

  if (!result.rows[0]) {
    throw new Error('not_found');
  }

  return mapWeek(result.rows[0]);
}

export async function getCurrentWeek() {
  const result = await queryDb<WeekRow>(
    `SELECT week_start_date::text, week_end_date::text, status
     FROM weekly_performance_weeks
     WHERE week_start_date = DATE_TRUNC('week', NOW())::date
     LIMIT 1`,
  );

  return result.rows[0] ? mapWeek(result.rows[0]) : null;
}

export async function getWeekMetrics(weekStartDate: string) {
  const result = await queryDb<MetricRow>(
    `SELECT metric_key, metric_value::text, metric_unit, source_plugin
     FROM weekly_performance_metrics
     WHERE week_start_date = $1
     ORDER BY metric_key ASC`,
    [weekStartDate],
  );

  return result.rows.map(mapMetric);
}

export async function getWeekComparison(input: { weekStartDate: string; compareWeekStartDate: string }) {
  const [base, compare] = await Promise.all([
    getWeekMetrics(input.weekStartDate),
    getWeekMetrics(input.compareWeekStartDate),
  ]);

  return {
    baseWeek: input.weekStartDate,
    compareWeek: input.compareWeekStartDate,
    base,
    compare,
  };
}

export async function insertWeeklyPerformanceAudit(input: {
  actorId: string;
  command: string;
  policyStatus: 'allow' | 'deny';
  reason: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}) {
  await queryDb(
    `INSERT INTO weekly_performance_audit_trail
      (id, actor_id, command, policy_status, reason, target_type, target_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
    [randomUUID(), input.actorId, input.command, input.policyStatus, input.reason, input.targetType, input.targetId, JSON.stringify(input.metadata ?? {})],
  );
}
