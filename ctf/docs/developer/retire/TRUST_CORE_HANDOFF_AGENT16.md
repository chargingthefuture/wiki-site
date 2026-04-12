# Trust Core Handoff (Agent 16)

## Objective

Deliver Trust as a privacy-safe shared plugin that helps survivors judge whether they want to interact with another member without creating a rating system, score, or stalking surface.

Phase 1 is intentionally narrow:

- verified/unverified trust badge
- member-since label
- coarse last-online bucket
- compact right-rail self view
- compact viewed-user preview with expandable details

## Product Decisions Locked for Phase 1

- Trust is not a social-credit score.
- Trust must never expose exact last-seen timestamps.
- Trust must never expose exact cumulative activity totals.
- Trust must never expose moderator evidence or reviewer identity in member-facing UI.
- Trust is a shared plugin surface that can appear inside other plugin views.
- Trust badge copy must state that the platform endorses no one and members should use their best judgment.

## Primary UI Surfaces

### 1) Personal Trust Card

Placement:

- directly below the welcome/profile card in the community shell right rail

Current host file:

- `ctf/packages/web/src/components/community-shell/shell-right-rail.tsx`

Current style host:

- `ctf/packages/web/src/components/community-shell/community-shell.module.css`

Compact card fields:

- section title: `Trust Signals`
- verification badge
- member since label (`Mar 2026` format)
- coarse presence label (`Active this week`)
- action label: `View trust details`

Desktop behavior:

- inline expansion or shared detail sheet

Mobile behavior:

- do not rely on right rail only because the rail is hidden below the tablet breakpoint
- expose Trust details through the profile area or a dedicated mobile sheet entry point

### 2) Viewed-User Trust Preview

Placement:

- directly beneath another member's name/header when that member is being viewed in a plugin

First implementation target:

- `ctf/packages/web/src/app/apps/directory/[id]/page.tsx`

Second implementation target:

- `ctf/packages/web/src/components/directory/directory-shell.tsx`

Compact preview fields:

- verification badge
- member since label
- coarse presence label
- expand affordance

Expanded detail sections:

- verification
- platform history
- presence
- safety note

## Shared Component Plan

Create shared web-only Trust UI under `packages/web/src/components/trust/`:

- `trust-badge.tsx`
- `trust-summary-card.tsx`
- `trust-inline-preview.tsx`
- `trust-details-panel.tsx`
- `trust-copy.ts`

Keep all server/data helpers under `packages/web/src/lib/trust/`:

- `types.ts`
- `constants.ts`
- `repository.ts`
- `policy.ts`
- `audit.ts`
- `mappers.ts`

## Data Contract Shape

### Member-Facing Summary

```ts
type TrustSummary = {
  subjectUserId: string;
  verificationStatus: "verified" | "unverified" | "under_review" | "restricted";
  memberSinceLabel: string | null;
  lastOnlineBucket:
    | "active_today"
    | "active_this_week"
    | "active_this_month"
    | "inactive_30_plus"
    | null;
  activityBucket: "new" | "light" | "established" | "long_term" | null;
  transactionBucket: "none" | "one_to_five" | "six_to_twenty" | "twenty_plus" | null;
  activePluginCount: number;
  trustVisibilityLevel: "standard" | "limited" | "hidden";
};
```

### Member-Facing Detail Payload

```ts
type TrustDetails = {
  summary: TrustSummary;
  verificationExplanation: string;
  safetyNote: string;
};
```

## Database Plan

Phase 1 schema should add:

- `trust_user_extension`
- `trust_signal_snapshots`
- `trust_admin_audit_trail`

Important constraint:

- no second profile table
- no plugin-local identity model
- no raw event mirror of other plugins

## API / Command Entry Points

Member-facing read path:

- `GET /api/trust/summary?subjectUserId=...` or equivalent plugin command adapter

Self-service update path:

- `PATCH /api/trust/visibility`

Moderator/admin path:

- `POST /api/trust/admin/verification/review`

System aggregation path:

- background task or server-only job for `trust.signal.snapshot.refresh`

All routes must map to the contract set in:

- `ctf/docs/contracts/TRUST_PLUGIN_COMMAND_CONTRACTS.yaml`
- `ctf/docs/contracts/TRUST_PLUGIN_ACCESS_POLICY_CONTRACTS.yaml`
- `ctf/docs/contracts/TRUST_PLUGIN_AUDIT_CONTRACTS.yaml`

## Phase 1 Copy

Compact labels:

- `Trust Signals`
- `Verified`
- `Unverified`
- `Member since`
- `Active today`
- `Active this week`
- `Active this month`
- `Inactive 30+ days`
- `View trust details`

Expanded verification copy:

- `A Verified badge means that the community believes this member is likely a TI.`
- `An Unverified badge means the community has not completed verification yet.`
- `The platform endorses no one. These signals can help you decide who to interact with. Use your best judgment at all times.`

## Explicit Non-Goals

Do not ship in Phase 1:

- numeric trust scores
- star ratings
- thumbs-up/down systems
- exact last seen timestamps
- exact minutes, hours, or days totals
- detailed transaction histories
- public moderation notes
- exact plugin activity timelines

## File Touch Map for First Implementation Pass

### Required new files

- `ctf/packages/web/src/components/trust/trust-badge.tsx`
- `ctf/packages/web/src/components/trust/trust-summary-card.tsx`
- `ctf/packages/web/src/components/trust/trust-inline-preview.tsx`
- `ctf/packages/web/src/components/trust/trust-details-panel.tsx`
- `ctf/packages/web/src/lib/trust/types.ts`
- `ctf/packages/web/src/lib/trust/repository.ts`
- `ctf/packages/web/src/lib/trust/constants.ts`

### Existing files to update

- `ctf/packages/web/src/components/community-shell/shell-right-rail.tsx`
- `ctf/packages/web/src/components/community-shell/community-shell.module.css`
- `ctf/packages/web/src/app/apps/directory/[id]/page.tsx`
- `ctf/packages/web/src/components/directory/directory-shell.tsx`
- `ctf/packages/web/src/lib/directory/types.ts` only if Trust summary is intentionally composed into Directory DTOs

## Delivery Order

1. Migration SQL for Trust extension and snapshot tables.
2. Trust repository and shared types.
3. Member-facing summary route/adapter.
4. Right-rail personal Trust card.
5. Directory viewed-user Trust preview.
6. Shared detail panel.
7. Mobile fallback entry point.

## Review Checklist

- [ ] No trust score language appears in copy or variable names.
- [ ] No exact timestamps are exposed to client components.
- [ ] No plugin bypasses shared Trust contracts.
- [ ] Right-rail placement works on desktop and has a mobile fallback.
- [ ] Viewed-user preview works in Directory before expansion to other plugins.
- [ ] Trust UI uses calm, plain language consistent with brand rules.

## Open Decisions

- Whether `member_since_at` is sourced from canonical account creation or a Trust-specific backfilled timestamp.
- Whether `transaction_bucket` ships in Phase 1 or is deferred until cross-plugin counting semantics are approved.
- Whether `under_review` is member-visible or reserved for internal/admin surfaces.

## Change Log

- 2026-03-25: Initial Trust Phase 1 handoff added covering shared UI placement, data contract shape, and file touch map.
