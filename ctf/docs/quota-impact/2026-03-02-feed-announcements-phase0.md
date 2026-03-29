# Stream Quota Impact Note

## Summary

- Feature/Change: Prompt 03 phase-0 feed + announcements combined stream, membership event fan-out, and admin lifecycle endpoints.
- PR: pending
- Owner: agent-03-feed-announcements
- Date: 2026-03-02

## Stream Surfaces Affected

- Chat / Activity Feeds / Video / AI Moderation: Activity feed-style event stream only (membership visibility events + announcement publish/archive projections).

## Estimated Monthly Impact

- Chat MAU impact estimate: negligible
- Activity Feed API calls estimate: +80k to +140k event writes/month in staging-like production profile
- Video participant-minutes estimate: none
- AI Moderation credits estimate: none

## Budget Threshold Risk

- Expected threshold after rollout (Green/Yellow/Orange/Red): Yellow
- Peak scenario estimate: Orange during campaign/batch publish windows with high membership churn

## Fallback and Degradation Plan

- What degrades first: external stream emission for membership events (DB canonical persistence remains)
- User-visible messaging behavior: timeline freshness may lag during degraded mode; canonical read APIs remain available
- Kill switch / feature flag: `feed_render_config.kill_switch_enabled` plus temporary disable of stream emitter path

## Observability

- Metrics and alerts added/updated: pending post-MVP (Rule 118), audit logs include command + outcome + error category
- Dashboard link (if available): pending

## Validation

- Tests added for degraded mode: deferred for MVP (Rule 118)
- Rollback strategy: disable event emission and replay from `feed_membership_events` / `announcement_delivery_events` after issue resolution
