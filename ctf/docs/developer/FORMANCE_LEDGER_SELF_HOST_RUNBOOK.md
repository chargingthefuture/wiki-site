# Formance Ledger Self-Host Runbook (Service Credits)

Date: 2026-03-04
Scope: `ctf/` monorepo Formance integration and deployment operations

## Support Boundaries

- Upstream Formance statement: production is officially supported through the Formance k8s operator.
- In this repo, Railway is a supported staging/runtime path for CTF integration and validation.
- Container artifacts are in GHCR (not Docker Hub).
- Vercel remains frontend-only and does not host Formance.

## Image Source Policy

- Registry: `ghcr.io/formancehq/ledger`
- Pin policy: use an explicit tag in Railway service config and update intentionally.
- Current pinned reference (multi-arch index): `ghcr.io/formancehq/ledger:v2.3.15-dev.1.g1077fe2@sha256:5c280c2b1b397c6d910e88d7f1719666fadf3b2be18ab6dad31a905dee876db7`
- Do not use floating Docker Hub image references.

### Verify pinned digest

Use this before updating the pinned reference:

- `docker buildx imagetools inspect ghcr.io/formancehq/ledger:v2.3.15-dev.1.g1077fe2`

Expected index digest:

- `sha256:5c280c2b1b397c6d910e88d7f1719666fadf3b2be18ab6dad31a905dee876db7`

## CTF Runtime Contract

### Required variables (`@ctf/web` runtime)

- `FORMANCE_API_URL`
- `FORMANCE_LEDGER`
- `FORMANCE_API_TOKEN`

### Optional variables (`@ctf/web` runtime)

- `FORMANCE_ASSET` (defaults to `SERVICE_CREDITS`)
- `SERVICE_CREDITS_REQUIRE_FORMANCE`
- `SERVICE_CREDITS_INTERNAL_TOKEN` (required for internal reclaim endpoint)

### Behavior contract

- Service Credits value-moving commands fail closed when Formance is unavailable.
- Missing config => `service_credits_external_ledger_not_configured`.
- Upstream rejection/unavailable => `service_credits_external_ledger_unavailable`.

## Local Bring-Up (Developer)

Use the monorepo scripts which mirror upstream standalone compose behavior.

1. `pnpm -C ctf run formance:up:standalone`
2. `http POST :8080/api/ledger/v2/quickstart`
3. `http POST :8080/api/ledger/v2/quickstart/transactions postings:='[{"amount":100,"asset":"USD/2","destination":"users:1234","source":"world"}]'`
4. Open `http://localhost:3000/formance/localhost?region=localhost`
5. Teardown: `pnpm -C ctf run formance:down:standalone`

## Railway Staging Deployment (Concrete)

Command reference for bootstrap and verification:

- `ctf/docs/developer/FORMANCE_LEDGER_RAILWAY_CURL_COMMANDS.md`
- Shortcut wrapper from repo root: `pnpm -C ctf run formance:bootstrap:railway`
- If already inside `ctf/`: `pnpm run formance:bootstrap:railway`

### A. Provision Formance service

1. Create Railway service: `formance-ledger`.
2. Deployment source: Docker image.
3. Image: `ghcr.io/formancehq/ledger:v2.3.15-dev.1.g1077fe2@sha256:5c280c2b1b397c6d910e88d7f1719666fadf3b2be18ab6dad31a905dee876db7`.
4. Start command: `serve --bind=0.0.0.0:${PORT} --worker=true --worker-grpc-address=127.0.0.1:8081`.
5. Attach dedicated PostgreSQL service.
6. Set `DATABASE_URL` in Formance service from attached Postgres.

### B. Configure CTF web service

1. Set `FORMANCE_API_URL` to the private Railway host for `formance-ledger` only (port 8080 path root), for example:
   - `http://ledger.railway.internal:8080`
2. Do not generate or use a public Railway domain for Formance-to-CTF server traffic.
3. Set `FORMANCE_LEDGER` (example: `ctf-service-credits`).
4. Set `FORMANCE_API_TOKEN` (required by CTF env precheck).
5. Optionally set `SERVICE_CREDITS_REQUIRE_FORMANCE=true` in non-production validation environments.

### C. Bootstrap ledger namespace

Run once against the Railway Formance URL (copy-paste commands are in the command reference above):

1. `http POST <FORMANCE_API_URL>/v2/<FORMANCE_LEDGER>`
2. Verify: `http GET <FORMANCE_API_URL>/v2`

### D. Smoke check from CTF path

1. Trigger a safe staging `POST /api/service-credits/transfers` call.
2. Verify non-error response and audit metadata with `externalLedger: formance`.
3. Temporarily unset token/URL in staging and confirm deterministic 503 deny behavior.

## Migration Ordering

Before enabling Formance-required runtime checks in staging/prod, run:

1. `pnpm -C ctf run migrate:service-credits:phase3`
2. `pnpm -C ctf run migrate:service-credits:formance-adapter:phase3`

## Operational Controls

### Token Rotation

1. Generate new token.
2. Update `FORMANCE_API_TOKEN` in CTF runtime.
3. Redeploy web service.
4. Revoke old token after smoke checks pass.

### Incident Handling

- If Formance is unavailable, do not disable fail-closed behavior.
- Keep Service Credits mutation commands returning deterministic 503 deny codes.

## Remaining Follow-Ups

1. Implement adapter outbox replay worker and dead-letter handling.
2. Implement reconciliation job between local adapter state and Formance history.
3. Maintain explicit pinned image tag update cadence in staging change management.
