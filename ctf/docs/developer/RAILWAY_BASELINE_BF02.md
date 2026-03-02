# BF-02 Railway Baseline

Date: 2026-03-01
Scope: Railway deployment baseline for `ctf/packages/web`

## What was changed

1. Railway startup now includes an auth/environment prestart gate.
2. Clerk env checker can auto-detect Railway environment target.
3. Railway failures for bad domain/URL auth wiring now fail fast at startup with explicit diagnostics.

## Deployment config

- File: `ctf/railway.toml`
- Start command now runs:
  1. `pnpm --filter @ctf/web run check:clerk-env`
  2. `pnpm --filter @ctf/web start`

This guarantees Railway won't start with misconfigured Clerk domain/env values.

## Environment/secret mapping assumptions

### Railway staging
- Required auth vars:
  - `RAILWAY_STAGING_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `RAILWAY_STAGING_CLERK_SECRET_KEY` or `CLERK_SECRET_KEY`
  - `RAILWAY_STAGING_CLERK_SIGN_IN_URL` or `CLERK_SIGN_IN_URL`
- Required app URL var:
  - `RAILWAY_NEXT_PUBLIC_APP_URL`

### Railway production
- Required auth vars:
  - `RAILWAY_PROD_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `RAILWAY_PROD_CLERK_SECRET_KEY` or `CLERK_SECRET_KEY`
  - `RAILWAY_PROD_CLERK_SIGN_IN_URL` or `CLERK_SIGN_IN_URL`
- Required app URL var:
  - `RAILWAY_NEXT_PUBLIC_APP_URL`

## Auto-target behavior

`check:clerk-env` resolution order:
1. `CLERK_ENV_TARGET` (explicit)
2. Railway inference from `RAILWAY_ENVIRONMENT_NAME`/related Railway env metadata:
   - contains `prod` => `railway-production`
   - otherwise => `railway-staging`

## Known Railway-specific failure that is now caught

- App URL host mismatch with sign-in URL host (for example apex vs `www`) now blocks startup with a clear message.

## Validation evidence

- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.
- Host mismatch simulation fails as expected with explicit diagnostic.

## What plugin teams can assume as stable

- Railway baseline now enforces Clerk/domain env correctness before app startup.
- Railway auth/runtime failures should surface as deterministic deploy/start errors rather than opaque runtime 500s.

## Remaining risks

1. Railway service must have correct custom domain DNS records (apex + optional `www` if used).
2. Clerk dashboard redirect/sign-in domain must exactly match active Railway domain.
3. If Railway metadata vars are unavailable in some environments, set `CLERK_ENV_TARGET` explicitly.

## BF-02 v2 Resolution Addendum (2026-03-02)

### What was incomplete
1. Railway build install path was not lockfile-deterministic (`--no-frozen-lockfile`).
2. Deploy workflow had no explicit staging/production GitHub Environment targeting.
3. Clerk env preflight diagnostics lacked explicit target-source output and strict deploy-host constraints.

### What is now closed
1. Railway build path is lockfile-deterministic (`--frozen-lockfile`) in `ctf/railway.toml`.
2. Railway deploy workflow now targets explicit environments (`rewrite-railway-staging` / `rewrite-railway-production`) and runs web build pre-deploy.
3. Clerk env preflight now logs target source and enforces HTTPS + non-localhost app URL constraints for Railway targets.

### Clarifying questions and answers used for v2 closure
1. Scope path for changes:
  - Answer: allow `.github/` edits.
2. Production deploy gate behavior now:
  - Answer: keep automatic deploy from `main`.
3. External blocker owner/date default:
  - Answer: Platform Ops — 2026-03-09.
4. Validation depth:
  - Answer: run existing checks only.

### Updated validation evidence for v2
- `pnpm --filter @ctf/web run check:clerk-env` passed for simulated `railway-staging`.
- `pnpm --filter @ctf/web run check:clerk-env` passed for simulated `railway-production`.
- `pnpm --filter @ctf/web run lint` passed.
- `pnpm --filter @ctf/web run build` passed.

### Remaining blockers / risks
1. Railway DNS and active host redirect alignment remains external to repo automation.
  - Owner: Platform Ops
  - Target date: 2026-03-09
  - Next action: verify apex/`www` DNS + Railway domain redirect policy and re-run Railway deploy smoke checks.
2. Clerk dashboard redirect/sign-in host alignment remains external to repo automation.
  - Owner: Platform Ops
  - Target date: 2026-03-09
  - Next action: confirm Railway active host exact-match entries in Clerk instance and validate sign-in roundtrip.

### Completion recommendation
- **complete**
