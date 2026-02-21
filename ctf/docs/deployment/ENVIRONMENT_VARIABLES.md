# Rewrite Environment Variables (ctf)

Related runbook: [Vercel Design Deployment (Separate Clerk Instance)](./VERCEL_DESIGN_DEPLOYMENT.md)

This rewrite must use its own environment configuration and observability DSNs, separate from legacy projects.

## Deployment Topology (Current)

- Runtime production/staging hosting is Railway (backend + frontend).
- Vercel/v0 is used for web design/preview workflow only.
- After v0/Vercel design iteration, changes are committed to Git and deployed via Railway.
- Do not treat Vercel as the source of truth for runtime secrets in this setup.

## Core Server (Railway)

- `APP_URL`
- `NODE_ENV`
- `DATABASE_URL`
- `SESSION_SECRET`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `STREAM_API_KEY`
- `STREAM_API_SECRET`
- `SENTRY_DSN` (rewrite-specific DSN)
- `SENTRY_TRACES_SAMPLE_RATE` (optional, default `0.02`)
- `SENTRY_ROUTE_ALLOWLIST_MODE` (optional, `true`/`false`, default `false`)
- `SENTRY_ALLOWED_ROUTE_PREFIXES` (optional, comma-separated, default `/,/api,/auth`)

## Web (Next.js)

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STREAM_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN` (rewrite-specific DSN)
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` (optional, default `0.02`)
- `NEXT_PUBLIC_SENTRY_ROUTE_ALLOWLIST_MODE` (optional, `true`/`false`, default `false`)
- `NEXT_PUBLIC_SENTRY_ALLOWED_ROUTE_PREFIXES` (optional, comma-separated, default `/,/api,/auth`)
- `NEXT_PUBLIC_OBSERVABILITY_PROVIDER` (`sentry`, `signoz`, `noop`)

## Mobile (Expo + React Native)

- `MOBILE_APP_URL`
- `MOBILE_CLERK_PUBLISHABLE_KEY`
- `MOBILE_SENTRY_DSN` (rewrite-specific DSN)
- `MOBILE_OBSERVABILITY_PROVIDER` (`sentry`, `signoz`, `noop`)

## EAS / CI

- `EXPO_TOKEN`
- `MOBILE_PROJECT_ID`
- `MOBILE_UPDATES_URL`

## Vercel (web preview/design workflow)

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

These are for Vercel CLI/API usage in CI or local automation, not Railway runtime environment variables.

## Variable Placement (Railway-Primary Runtime)

- Railway backend service: server secrets (`DATABASE_URL`, `SESSION_SECRET`, `CLERK_SECRET_KEY`, `STREAM_API_SECRET`, etc.)
- Railway frontend service/build: web runtime/build vars needed by Next.js (`NEXT_PUBLIC_*`)
- CI/local shell (when calling Vercel CLI/API): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Never commit any secrets to Git

## Rules

- Do not reuse legacy `VITE_*` variables in rewrite packages.
- Keep rewrite DSNs and API keys isolated from legacy projects.
- Use separate Sentry projects/DSNs for web and mobile to avoid mixed noise and preserve free-tier quotas.
- Never commit raw secrets.
- Keep Railway as the runtime secret authority for deployed app services in this topology.
