# Formance Ledger Self-Host Runbook (Service Credits)

Date: 2026-03-04
Scope: `ctf/` monorepo, Railway-hosted Formance for Service Credits

## Objective

Provide a production-ready, self-hosted Formance ledger instance for the `service-credits` plugin and enforce fail-closed integration from CTF web runtime.

## Topology

- Canonical backend runtime remains Railway.
- Formance runs as a dedicated Railway service in the same Railway project/network.
- CTF web service calls Formance over private/internal network URL whenever possible.
- Vercel is frontend-only and does not host Formance.

## Required Runtime Variables (CTF Web)

- `FORMANCE_API_URL` (required)
- `FORMANCE_LEDGER` (required)
- `FORMANCE_API_TOKEN` (required)
- `FORMANCE_ASSET` (optional, defaults to `SERVICE_CREDITS`)

## Required Runtime Variables (Formance Service)

- Formance database URL / storage variables as required by selected image version.
- Any Formance auth token/bootstrap variables required by image startup.

## Provisioning Steps (Railway)

1. Create Railway service `formance-ledger` in the same project as CTF web.
2. Attach a dedicated PostgreSQL for Formance service state.
3. Set Formance service variables and start command per chosen image/version docs.
4. Expose Formance internal/private URL to CTF web as `FORMANCE_API_URL`.
5. Set `FORMANCE_LEDGER` to the canonical ledger name used by Service Credits.
6. Generate and store `FORMANCE_API_TOKEN` as a Railway secret.
7. Deploy CTF web with prestart env checks enabled.

## CTF Integration Contract

- Service Credits value-moving commands must post ledger transactions to Formance.
- Missing Formance config returns deterministic `service_credits_external_ledger_not_configured`.
- Formance failure/rejection returns deterministic `service_credits_external_ledger_unavailable`.
- Local DB mutation paths are fail-closed around external ledger posting.

## Operational Controls

### Token Rotation

1. Create a new Formance API token.
2. Update Railway secret `FORMANCE_API_TOKEN`.
3. Redeploy CTF web.
4. Revoke old token after successful health and transfer checks.

### Health/Readiness

- Verify Formance endpoint reachability from CTF runtime.
- Execute a non-production safe transfer flow in staging.
- Confirm service-credits audit metadata includes `externalLedger: formance`.

### Incident Handling

- If Formance is down, Service Credits transfer/escrow/governance/treasury mutation routes must remain unavailable (503 deny codes).
- Do not bypass Formance with local-only mutation fallbacks in production.

## Validation Checklist

- CTF startup passes Formance env validation in Railway.
- `POST /api/service-credits/transfers` succeeds with valid Formance config.
- Same route fails with deterministic deny codes when token/URL are invalid.
- Audit rows include external ledger transaction references.

## Open Items

1. Finalize pinned Formance image/tag and bootstrap command in deployment manifests.
2. Add background outbox replay worker for adapter retries/dead-letter handling.
3. Add periodic reconciliation job between local transfer state and Formance transaction references.
