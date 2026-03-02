# BF-04 Expo Baseline

Date: 2026-03-01
Scope: Expo/EAS Android deployment baseline for `ctf/packages/mobile`

## What was changed

1. Added `ctf/packages/mobile/eas.json` with required build profiles and channels:
   - `preview`
   - `staging`
   - `production`
2. Added `ctf/packages/mobile/app.config.ts` for env-driven Expo/EAS config.
3. Added mobile env contract preflight checker:
   - `ctf/packages/mobile/scripts/check-mobile-env.mjs`
   - package script: `check:mobile-env`
4. Wired preflight env gate into Expo workflows:
   - `.github/workflows/expo-preview.yml`
   - `.github/workflows/expo-update.yml`
   - `.github/workflows/expo-android-release.yml`
5. Updated mobile workflow guide to reflect env contract and preflight checks.

## Android build profile and release-path notes

- `preview`: internal distribution APK for PR/device testing.
- `staging`: internal distribution APK aligned to staging channel.
- `production`: signed production APK path for release/tag workflows.
- Runtime policy uses `appVersion` to reduce OTA/native mismatch risk.

## Mobile env contract alignment (Railway/Vercel/Clerk)

### Canonical Expo vars

- `EXPO_MOBILE_PROJECT_ID`
- `EXPO_MOBILE_UPDATES_URL`
- `EXPO_SENTRY_DSN`

### Mobile runtime vars

- `MOBILE_APP_URL` (points to canonical backend/runtime host, typically Railway)
- `MOBILE_CLERK_PUBLISHABLE_KEY_STAGING`
- `MOBILE_CLERK_PUBLISHABLE_KEY_PRODUCTION`
- `MOBILE_OBSERVABILITY_PROVIDER`

### Compatibility fallback support

- `MOBILE_PROJECT_ID` and `MOBILE_UPDATES_URL` still resolve if canonical `EXPO_MOBILE_*` vars are absent.

## CI/manual workflow alignment notes

- Expo workflows now fail early if profile-appropriate env values are missing.
- PR preview build still required for device-testable APK evidence.
- Production release workflow keeps signed APK publication path to GitHub Releases.

## Validation evidence

- `pnpm --filter @ctf/mobile run check:mobile-env` passes with valid mock env values.
- Expo config files now exist where CI expects them:
  - `packages/mobile/eas.json`
  - `packages/mobile/app.config.ts`
- Existing web baseline checks remain unaffected.

## Remaining blockers/risks

1. GitHub repo/environment variables and secrets must be populated for all profiles.
2. Expo project ownership (`EXPO_OWNER`) must match the EAS project used by `EXPO_TOKEN`.
3. Mobile app base URL must point to reachable deployed host for chosen environment.

## BF-04 v2 Resolution Addendum (2026-03-02)

### What was incomplete
1. Expo workflows allowed skip-on-missing-token behavior, which masked deployment readiness failures.
2. Expo workflows did not target rewrite-scoped GitHub Environments for preview/staging/production isolation.
3. Mobile env preflight lacked strict deploy-host validation and production owner requirement.

### What is now closed
1. Expo preview/update/release workflows now fail fast when `EXPO_TOKEN` is missing.
2. Expo workflows now target rewrite-scoped environments:
   - `rewrite-mobile-preview`
   - `rewrite-mobile-staging`
   - `rewrite-mobile-production`
3. `check:mobile-env` now enforces:
   - `MOBILE_APP_URL` must be valid HTTPS and non-localhost
   - `EXPO_OWNER` required for production profile validation

### Clarifying questions and answers used for v2 closure
1. Scope path for changes:
   - Answer: allow `.github/` edits.
2. Missing-token behavior:
   - Answer: fail-fast on missing token.
3. Workflow environment targeting:
   - Answer: use rewrite mobile environments.
4. Validation depth:
   - Answer: run existing checks only.

### Updated validation evidence for v2
- `pnpm --filter @ctf/mobile run check:mobile-env` passed for simulated `preview`.
- `pnpm --filter @ctf/mobile run check:mobile-env` passed for simulated `production`.
- `pnpm --filter @ctf/mobile run lint` passed.
- `pnpm --filter @ctf/mobile run typecheck` passed.
- `pnpm --filter @ctf/mobile run build` passed.

### Remaining blockers / risks
1. EAS project/account ownership and token authorization remain external configuration.
   - Owner: Platform Ops
   - Target date: 2026-03-09
   - Next action: verify `EXPO_OWNER`, project ownership, and token scope alignment in Expo dashboard.
2. Mobile endpoint reachability remains external runtime validation.
   - Owner: Platform Ops
   - Target date: 2026-03-09
   - Next action: confirm deployed `MOBILE_APP_URL` target responds for mobile auth and core API routes.

### Completion recommendation
- **complete**
