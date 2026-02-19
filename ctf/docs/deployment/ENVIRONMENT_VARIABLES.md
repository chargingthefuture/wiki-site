# Rewrite Environment Variables (ctf)

This rewrite must use its own environment configuration and observability DSNs, separate from legacy projects.

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
- `NEXT_PUBLIC_SENTRY_DSN` (rewrite-specific DSN)
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` (optional, default `0.02`)
- `NEXT_PUBLIC_SENTRY_ROUTE_ALLOWLIST_MODE` (optional, `true`/`false`, default `false`)
- `NEXT_PUBLIC_SENTRY_ALLOWED_ROUTE_PREFIXES` (optional, comma-separated, default `/,/api,/auth`)
- `NEXT_PUBLIC_OBSERVABILITY_PROVIDER` (`sentry`, `signoz`, `noop`)

## Mobile (Expo + React Native)

- `EXPO_PUBLIC_APP_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SENTRY_DSN` (rewrite-specific DSN)
- `EXPO_PUBLIC_OBSERVABILITY_PROVIDER` (`sentry`, `signoz`, `noop`)

## EAS / CI

- `EXPO_TOKEN`
- `EXPO_PROJECT_ID`
- `EXPO_UPDATES_URL`

## Vercel (web preview/design workflow)

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Rules

- Do not reuse legacy `VITE_*` variables in rewrite packages.
- Keep rewrite DSNs and API keys isolated from legacy projects.
- Use separate Sentry projects/DSNs for web and mobile to avoid mixed noise and preserve free-tier quotas.
- Never commit raw secrets.
