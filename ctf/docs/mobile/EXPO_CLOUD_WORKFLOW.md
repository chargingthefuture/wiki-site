# Expo Cloud Workflow

This project uses cloud-first mobile delivery so development can proceed without Android Studio.

## Required Secrets and Variables

Configure in repository settings:

- `EXPO_TOKEN` (GitHub secret): token for EAS CLI auth.
- `EXPO_PROJECT_ID` (GitHub variable or environment variable): Expo project identifier used by `app.config.ts`.
- `EXPO_UPDATES_URL` (GitHub variable or environment variable): EAS updates URL for the project.

## Branch to Channel Mapping

- `main` → `production`
- `staging` or `release/staging` → `staging`
- any other branch → `preview`

## Workflows

- `.github/workflows/expo-preview.yml`
  - Builds Android APK with EAS for pull requests.
  - Posts/updates a PR comment containing profile, channel, and install link when available.

- `.github/workflows/expo-update.yml`
  - Publishes EAS updates on branch pushes using branch-channel mapping.
  - Intended for JavaScript/asset-only updates.

- `.github/workflows/expo-android-release.yml`
  - Builds signed production APK and publishes to GitHub Releases on `mobile-v*` tags.

## When to Use EAS Build vs EAS Update

- Use **EAS Build** for native dependency/configuration changes.
- Use **EAS Update** for JavaScript and asset-only changes compatible with current runtime version.
