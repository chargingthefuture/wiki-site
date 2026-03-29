# Chyme First Test Pass

This checklist validates Chyme before adding new plugins.

## 0) Prerequisites

- Install dependencies at `ctf/` root:
  - `pnpm install`
- Create local env file:
  - `cp packages/web/.env.local.example packages/web/.env.local`
- Fill required values in `packages/web/.env.local`:
  - `RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `RAILWAY_STAGING_CLERK_SECRET_KEY` for `the-comic.com`
  - `RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `RAILWAY_PROD_CLERK_SECRET_KEY` for `chargingthefuture.com`
  - `RAILWAY_STAGING_CLERK_SIGN_IN_URL` and `RAILWAY_PROD_CLERK_SIGN_IN_URL`
  - `DATABASE_URL`
  - `STREAM_API_KEY`
  - `STREAM_API_SECRET`

## 1) Baseline Quality Gates

Run from `ctf/`:

- `pnpm --filter @ctf/web lint`
- `pnpm --filter @ctf/web typecheck`
- `pnpm --filter @ctf/web build`

Expected:

- lint: pass
- typecheck: pass
- build: pass only when valid Clerk publishable key is present

## 2) Apply Chyme Migration

Run SQL in Neon console:

- `ctf/migrations/2026-03-01-chyme-core-phase0.sql`

Expected tables:

- `chyme_rooms`
- `chyme_service_profiles`
- `chyme_room_members`
- `chyme_messages`
- `chyme_deletion_events`

Run deterministic seed script:

- `node ctf/scripts/seedChymePhase0.mjs`

## 3) Start Web App

From `ctf/`:

- `pnpm --filter @ctf/web dev`

Open app and sign in with Clerk.

## 4) Functional Checks

### Room load

- Action: open Chyme screen.
- Expected:
  - room state loads
  - participant row is upserted for current user
  - no crash in UI

### Chat send

- Action: send a chat message.
- Expected:
  - message appears in UI
  - row appears in `chyme_messages`

### Join call

- Action: click `Join Call`.
- Expected:
  - success status in UI
  - Stream user token issued
  - Stream channel `messaging:chyme-main-room` watched/connected

### Service-scoped deletion

- Action: click `Delete Chyme Data` and confirm.
- Expected:
  - `chyme_service_profiles.status` becomes `deleted`
  - user rows removed from `chyme_room_members` and `chyme_messages`
  - service deletion event added to `chyme_deletion_events` with scope `service`

### Full account request

- Action: click `Delete Full Account` and confirm.
- Expected:
  - event added to `chyme_deletion_events` with scope `account`
  - note: current behavior records request only (global orchestrator pending)

## 5) Current Known Warnings (Non-blocking for Chyme MVP)

- Next warns that Next.js ESLint plugin is not explicitly detected in config.
- Sentry warns about optional app router instrumentation updates.
- CSS autoprefixer warns about `align-items: start`; can be changed to `flex-start` later.

## 6) Blockers to Treat as Failures

- Missing/invalid Clerk publishable key (build/runtime failure).
- Missing Neon `DATABASE_URL` (API persistence failure).
- Missing Stream keys (join returns service unavailable).
