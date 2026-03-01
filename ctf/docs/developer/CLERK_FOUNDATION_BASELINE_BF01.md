# BF-01 Clerk Foundation Baseline

Date: 2026-03-01
Scope: `ctf/packages/web` only

## What Was Implemented

### Clerk as sole web identity provider baseline
- Added Clerk provider to web root layout.
- Added Clerk middleware for protected web routes:
  - `/plugin/**`
  - `/admin/**`
- Added server-side authorization adapter used by routes and API handlers.

### App Router + server-side guardrails evidence
- Protected page route: `/plugin`
- Role-protected page route: `/admin` (requires role `admin`)
- Server policy probe route: `/api/plugin/policy-probe`

All checks run on the server using Clerk session context via `@clerk/nextjs/server`.

## Environment Contract (Rule 123 Aligned)

### Contract file
- `ctf/packages/web/.env.local.example`

### Environment model
1. Staging Railway (frontend+backend on Railway)
2. Staging Vercel (frontend on Vercel, backend on Railway)
3. Production Railway (frontend+backend on Railway)

### Important constraints
- Clerk is domain-bound; each environment requires separate Clerk credentials.
- `*.vercel.app` is not acceptable for Clerk; use custom Vercel staging domain.
- Do not rename or remove environment variables from the contract file.

### Local note
Rule 123 defines no official local environment. Local runs are only for smoke checks and must mimic one of the three deployment environment contracts.

## CI / Config Notes for Clerk-dependent Checks

### Validation command
From `ctf/packages/web`:
- `CLERK_ENV_TARGET=railway-staging pnpm run check:clerk-env`
- `CLERK_ENV_TARGET=vercel-staging pnpm run check:clerk-env`
- `CLERK_ENV_TARGET=railway-production pnpm run check:clerk-env`

### Script behavior
- Fails fast if required Clerk keys are missing for the selected deployment target.
- Meant for CI pre-deploy gates and deploy-time smoke checks.

### Runtime fallback behavior
- Web runtime resolves Clerk keys from both unprefixed and environment-prefixed names.
- This prevents middleware startup failures when deployment uses Rule-123 prefixed keys.

Resolution order per key family:
1. Unprefixed (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_SIGN_IN_URL`)
2. Railway staging prefixed
3. Vercel staging prefixed
4. Railway production prefixed

## Deny Taxonomy Baseline
- Canonical deny taxonomy doc:
  - `ctf/docs/contracts/PLUGIN_AUTH_DENY_TAXONOMY_BASELINE.md`
- Implemented in web code:
  - `ctf/packages/web/src/lib/auth/deny-taxonomy.ts`

## Validation Evidence

### Automated
- `pnpm --filter @ctf/web run lint`
- `pnpm --filter @ctf/web run build`

### Manual smoke checks
1. Unauthenticated:
   - Visit `/plugin` and verify middleware-auth behavior.
   - Call `/api/plugin/policy-probe` and verify `401 AUTH_UNAUTHORIZED`.
2. Authenticated non-admin:
   - Visit `/admin` and verify deny behavior.
   - Call `/api/plugin/policy-probe?adminOnly=true` and verify `403 AUTH_FORBIDDEN_ROLE`.
3. Authenticated admin:
   - Visit `/admin` and verify successful server-side access.

## Open Decisions / Blockers
1. Role source-of-truth shape in Clerk session claims:
   - Baseline checks `metadata.role` then `publicMetadata.role`.
   - Team should lock final Clerk role claim location and naming convention.
2. Production key naming preference:
   - Validation script currently expects unprefixed production Clerk keys.
   - If `RAILWAY_PROD_*` keys are preferred, update contract by explicit approval only.

## Troubleshooting: `MIDDLEWARE_INVOCATION_FAILED`
If Railway returns `500` with code `MIDDLEWARE_INVOCATION_FAILED`:
1. Run `CLERK_ENV_TARGET=railway-staging pnpm run check:clerk-env` in `ctf/packages/web`.
2. Add missing Clerk env keys in Railway service Variables.
3. Confirm domain-specific Clerk instance matches deployed frontend domain.
4. Redeploy and re-check `/` and `/api/plugin/policy-probe`.
