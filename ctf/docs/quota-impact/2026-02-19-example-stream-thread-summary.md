# Stream Quota Impact Note

## Summary
- Feature/Change: Thread summary command for chat conversations.
- PR: example-placeholder
- Owner: platform-chat
- Date: 2026-02-19

## Stream Surfaces Affected
- Chat / Activity Feeds / Video / AI Moderation: Chat, Activity Feeds, AI Moderation.

## Estimated Monthly Impact
- Chat MAU impact estimate: no net MAU increase from this feature alone.
- Activity Feed API calls estimate: +18,000 to +24,000 calls/month.
- Video participant-minutes estimate: none.
- AI Moderation credits estimate: +$12 to +$20/month (summary pre-checks and output moderation).

## Budget Threshold Risk
- Expected threshold after rollout (Green/Yellow/Orange/Red): Yellow.
- Peak scenario estimate: Orange if feature adoption exceeds 2x forecast.

## Fallback and Degradation Plan
- What degrades first: disable auto-summary generation in low-priority channels.
- User-visible messaging behavior: show "Summary is temporarily limited; core chat remains available." message.
- Kill switch / feature flag: `chat.threadSummary.enabled` and `chat.threadSummary.autoMode`.

## Observability
- Metrics and alerts added/updated: `stream.feed_calls_monthly`, `stream.ai_moderation_spend_monthly`, threshold alerts at 70/85/95/100.
- Dashboard link (if available): placeholder-dashboard-link

## Validation
- Tests added for degraded mode: yes, includes threshold-triggered disablement and fallback messaging tests.
- Rollback strategy: disable flags above and redeploy config-only rollback within one release cycle.
