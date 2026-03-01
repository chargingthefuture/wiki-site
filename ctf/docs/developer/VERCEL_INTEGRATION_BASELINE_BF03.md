# BF-03 Vercel Integration Baseline

Date: 2026-03-01
Scope: Vercel staging frontend integration for `ctf/packages/web`

## What was changed

1. Added Vercel project config at `ctf/packages/web/vercel.json`.
2. Added Vercel staging env validation script target in `ctf/packages/web/package.json`.
3. Extended Clerk env checker to infer `vercel-staging` automatically when running in Vercel.

## Vercel-to-Railway integration decisions

- Backend runtime remains canonical on Railway.
- Vercel is frontend-hosting for staging preview/iteration.
- Clerk keys for Vercel must be Vercel-specific and domain-bound to the Vercel custom staging domain.

## Environment isolation assumptions

### Vercel staging frontend
- `VERCEL_NEXT_PUBLIC_APP_URL` = Vercel custom staging domain
- `VERCEL_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `VERCEL_CLERK_SECRET_KEY`
- `VERCEL_CLERK_SIGN_IN_URL`

### Railway backend (shared by Vercel staging)
- `RAILWAY_NEXT_PUBLIC_APP_URL` remains Railway runtime domain contract for Railway-hosted frontend/backend baseline.
- Railway Clerk keys remain isolated from Vercel Clerk keys.

## Route/proxy assumptions for plugin teams

1. Authentication domain on Vercel staging uses Vercel custom domain Clerk instance.
2. Backend business APIs remain Railway-owned.
3. Any frontend-to-backend cross-origin path from Vercel must use explicit Railway API origins and CORS policy.
4. Plugin command routes must continue server-side policy checks; hosting origin does not change policy boundaries.

## CI / staging check updates

- `ctf/packages/web/vercel.json` build command now includes:
  - `pnpm --filter @ctf/web run check:vercel-staging`
  - then `pnpm --filter @ctf/web build`

This enforces Clerk/domain env contract before Vercel build completes.

## Validation evidence

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.
- `CLERK_ENV_TARGET=vercel-staging pnpm --filter @ctf/web run check:clerk-env` passed with valid env values.

## Remaining staging risks

1. Vercel custom staging domain must exist and be configured in Clerk allowed redirect URLs.
2. Railway backend CORS must explicitly allow Vercel staging origin.
3. If Vercel build environment omits required `VERCEL_*` Clerk variables, deployment is blocked by env check step.
