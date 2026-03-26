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
- `CLERK_ENV_TARGET=railway-production pnpm run check:clerk-env`

Note: The check now auto-detects CLERK_ENV_TARGET from Railway-prefixed env vars or NEXT_PUBLIC_APP_URL when possible. If the target cannot be determined, the check fails and prevents startup. Set CLERK_ENV_TARGET explicitly in CI or deployments if needed.

### Script behavior

- Fails fast if required Clerk keys are missing for the selected deployment target.
- Meant for CI pre-deploy gates and deploy-time smoke checks.

### Runtime fallback behavior

- Web runtime resolves Clerk keys from both unprefixed and environment-prefixed names.
- This prevents middleware startup failures when deployment uses Rule-123 prefixed keys.

Resolution order per key family:

1. Unprefixed (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_SIGN_IN_URL`)
2. Railway staging prefixed
3. Railway production prefixed

Note: Vercel-specific prefixes are deprecated. Runtime will resolve unprefixed keys first, then Railway-prefixed fallbacks.

## Deny Taxonomy Baseline

- Canonical deny taxonomy doc:
  - `ctf/docs/contracts/PLUGIN_AUTH_DENY_TAXONOMY_BASELINE.md`
- Implemented in web code:
  - `ctf/packages/web/src/lib/auth/deny-taxonomy.ts`

## Canonical Username Handle Baseline

- Canonical handle source for plugin username/`@mention` semantics is Clerk `username`.
- Shared contract doc:
  - `ctf/docs/contracts/PLUGIN_IDENTITY_HANDLE_BASELINE.md`
- Plugin implications:
  - do not create plugin-specific username ownership fields,
  - use Clerk `username` for handle semantics,
  - if username is missing, use non-handle display fallback and avoid synthetic `@username` creation.

### Username-required route behavior

- Plugin routes that require a canonical handle can enforce `username` presence server-side.
- Missing username now maps to deny taxonomy reason `missing_username` under `AUTH_FORBIDDEN_POLICY`.
- UX guidance for signed-in users: open profile/avatar and choose username update.

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

## BF-01 v2 Resolution Addendum (2026-03-02)

### Decisions locked in this pass

1. Role source-of-truth in Clerk session claims is now canonicalized to `publicMetadata.role`.
2. Production Clerk variable preference is now canonicalized as unprefixed keys, with compatibility fallback support for `RAILWAY_PROD_*`.

### Scaffold-removal completion

- `/plugin` baseline route no longer returns scaffold-only output for non-Chyme plugin routing.
- `/admin` baseline route no longer returns scaffold-only output.
- Both routes now provide production-grade baseline policy outcomes with stable deny taxonomy details.

### Clarifying questions and answers used for v2 closure

1. Role claim source:
   - Answer: `publicMetadata.role` only.
2. Production env key policy:
   - Answer: canonical unprefixed preference with `RAILWAY_PROD_*` fallback compatibility.
3. Scaffold-only route behavior:
   - Answer: upgrade now in BF-01 v2.
4. Validation depth:
   - Answer: run existing checks only.

### Updated validation evidence for v2

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

## Remaining Decisions / Blockers

- None blocking BF-01 baseline completion.

## Troubleshooting: `MIDDLEWARE_INVOCATION_FAILED`

If Railway returns `500` with code `MIDDLEWARE_INVOCATION_FAILED`:

1. Run `CLERK_ENV_TARGET=railway-staging pnpm run check:clerk-env` in `ctf/packages/web`.
2. Add missing Clerk env keys in Railway service Variables.
3. Confirm domain-specific Clerk instance matches deployed frontend domain.
4. Redeploy and re-check `/` and `/api/plugin/policy-probe`.
