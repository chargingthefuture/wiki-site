# TI Skills Economy Monorepo (ctf)

This folder contains the rewrite monorepo scaffold for:

- Next.js web application (`packages/web`)
- React Native mobile application (`packages/mobile`)
- Shared platform-agnostic logic (`packages/shared`)

## Quick Start

1. Install dependencies
   - `pnpm install`
2. Run web app
   - `pnpm run dev:web`
3. Run mobile app (cloud-first Expo workflow)
   - `pnpm run dev:mobile`

## Mobile Cloud Workflow

- Preview Android builds: GitHub Actions workflow `Expo Preview Build`
- Production APK release: GitHub Actions workflow `Expo Android Release`
- JavaScript-only updates: EAS Update channels (`preview`, `staging`, `production`)

## Observability Provider Selection

- Web: set `NEXT_PUBLIC_OBSERVABILITY_PROVIDER` to `sentry`, `signoz`, or `noop`.
- Mobile: set `MOBILE_OBSERVABILITY_PROVIDER` to `sentry`, `signoz`, or `noop`.
- Unknown or missing values default to `noop`.

## Structure

- `packages/shared`: API wrappers, domain models, and reusable logic
- `packages/web`: Next.js web application
- `packages/mobile`: Expo + React Native Android application

## Invite-Only Access Flow (Rewrite)

- Users sign in with Clerk on the web app root page.
- First-time users must submit a Quora profile URL.
- Access stays pending until an admin approves them.
- Admins (existing `users.is_admin = true`) can review and approve users at `/admin/users`.

## Prompt Leak Protection

- This repository includes git hooks that block committing/pushing AI prompt text patterns.
- One-time setup (run from repository root): `git config core.hooksPath .githooks`
- Store temporary prompt drafts in `.ai/` (already ignored by git).
