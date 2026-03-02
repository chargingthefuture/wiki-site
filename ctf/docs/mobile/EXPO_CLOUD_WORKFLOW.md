# Expo Cloud Workflow

This project uses cloud-first mobile delivery so development can proceed without Android Studio.

## Required Secrets and Variables

Configure in repository settings:

- `EXPO_TOKEN` (GitHub secret): token for EAS CLI auth.
- `EXPO_OWNER` (GitHub variable): Expo account/organization owner for production release targeting.
- `EXPO_MOBILE_PROJECT_ID` (GitHub variable): Expo project identifier used by `app.config.ts`.
- `EXPO_MOBILE_UPDATES_URL` (GitHub variable): EAS updates URL for the project.

Compatibility fallback keys are still accepted by CI/config resolver:

- `MOBILE_PROJECT_ID`
- `MOBILE_UPDATES_URL`

## Branch to Channel Mapping

- `main` → `production`
- `staging` or `release/staging` → `staging`
- any other branch → `preview`

## Workflows

- `.github/workflows/expo-preview.yml`
  - Builds Android APK with EAS for pull requests.
  - Posts/updates a PR comment containing profile, channel, and install link when available.
  - Runs in GitHub Environment `rewrite-mobile-preview`.
  - Fails fast when `EXPO_TOKEN` is missing.

- `.github/workflows/expo-update.yml`
  - Publishes EAS updates on branch pushes using branch-channel mapping.
  - Intended for JavaScript/asset-only updates.
  - Maps branch to GitHub Environment: `rewrite-mobile-preview` / `rewrite-mobile-staging` / `rewrite-mobile-production`.
  - Fails fast when `EXPO_TOKEN` is missing.

- `.github/workflows/expo-android-release.yml`
  - Builds signed production APK and publishes to GitHub Releases on `mobile-v*` tags.
  - Runs in GitHub Environment `rewrite-mobile-production`.
  - Fails fast when `EXPO_TOKEN` is missing.

## When to Use EAS Build vs EAS Update

- Use **EAS Build** for native dependency/configuration changes.
- Use **EAS Update** for JavaScript and asset-only changes compatible with current runtime version.

## Deployment Readiness Checklist (Current Rewrite)

Before shipping additional features, verify these first:

1. **Environment variables** are configured for mobile runtime:

- `MOBILE_CLERK_PUBLISHABLE_KEY_STAGING` (Expo Go/dev and non-production EAS profiles)
- `MOBILE_CLERK_PUBLISHABLE_KEY_PRODUCTION` (production APK/release)
- `EXPO_OWNER` (required for production-target validation)
- `MOBILE_APP_URL` (base URL of the deployed web/API host, no trailing slash)
- `MOBILE_OBSERVABILITY_PROVIDER`
- `MOBILE_SENTRY_DSN` (when using Sentry)

2. **CI preflight env gate** passes in Expo workflows:

- `pnpm --filter @ctf/mobile run check:mobile-env`
- Validates profile-sensitive env contract before EAS build/update steps.

3. **Type safety** passes:

- `pnpm --filter @ctf/mobile typecheck`

4. **Invite-only flow smoke test** on a preview APK:

- Signed-out user sees sign-in form.
- Signed-in, unapproved user is prompted for Quora URL.
- After saving Quora URL, user sees pending approval state.
- After admin approval (`users.is_approved = true`), user can access approved app shell.

5. **Cloud build path** succeeds:

- `preview` build via `.github/workflows/expo-preview.yml`
- install and launch generated APK on Android device.
