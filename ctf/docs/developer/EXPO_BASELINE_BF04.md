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
