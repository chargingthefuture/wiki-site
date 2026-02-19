# Stream Quota Impact Note

## Summary
- Feature/Change: Drop-in group video room from chat channel action.
- PR: example-placeholder-video
- Owner: platform-realtime
- Date: 2026-02-19

## Stream Surfaces Affected
- Chat / Activity Feeds / Video / AI Moderation: Chat, Video.

## Estimated Monthly Impact
- Chat MAU impact estimate: +80 to +140 MAU/month from increased engagement.
- Activity Feed API calls estimate: +2,500 to +4,500 calls/month for room lifecycle events.
- Video participant-minutes estimate: +95,000 to +145,000 participant-minutes/month.
- AI Moderation credits estimate: +$0 to +$8/month (metadata checks only, no transcript moderation).

## Budget Threshold Risk
- Expected threshold after rollout (Green/Yellow/Orange/Red): Yellow for video minutes.
- Peak scenario estimate: Orange during coordinated events or community campaigns.

## Fallback and Degradation Plan
- What degrades first: reduce max room duration and participant cap for non-priority channels.
- User-visible messaging behavior: show "Video rooms are temporarily limited; chat remains fully available." notice.
- Kill switch / feature flag: `video.dropin.enabled`, `video.dropin.maxParticipants`, `video.dropin.maxDurationMinutes`.

## Observability
- Metrics and alerts added/updated: `stream.video_participant_minutes_monthly`, `stream.video_room_create_rate`, threshold alerts at 70/85/95/100.
- Dashboard link (if available): placeholder-video-dashboard-link

## Validation
- Tests added for degraded mode: yes, includes dynamic cap reduction and video-entry denial fallback UX tests.
- Rollback strategy: disable `video.dropin.enabled` and preserve channel chat entry points.
