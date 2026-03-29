# Formance Ledger Railway Curl Commands

Date: 2026-03-04
Scope: Copy-paste commands to initialize and verify Formance on Railway private networking.

## Prerequisites

- Formance service is deployed in Railway and connected to its own Postgres via `DATABASE_URL`.
- CTF web service and Formance service are on Railway private networking.
- `FORMANCE_API_URL`, `FORMANCE_LEDGER`, and `FORMANCE_API_TOKEN` are set.

## 1) Set local shell variables

```bash
export FORMANCE_API_URL="http://ledger.railway.internal:8080"
export FORMANCE_LEDGER="ctf-service-credits"
export FORMANCE_API_TOKEN="<your-real-token>"
```

## 1.5) One-command wrapper (recommended)

From repo root (`/workspaces/chargingthefuture`):

```bash
pnpm -C ctf run formance:bootstrap:railway
```

If you are already inside `ctf/` (`/workspaces/chargingthefuture/ctf`):

```bash
pnpm run formance:bootstrap:railway
```

This runs bootstrap + ledger list + smoke transaction + transaction fetch using the same env vars above.

## 2) Bootstrap ledger namespace (run once)

```bash
curl -sS -i -X POST \
  -H "Authorization: Bearer ${FORMANCE_API_TOKEN}" \
  "${FORMANCE_API_URL}/v2/${FORMANCE_LEDGER}"
```

Expected outcomes:

- `201` when created.
- `409` if it already exists (safe to continue).

## 3) Verify ledger namespace exists

```bash
curl -sS \
  -H "Authorization: Bearer ${FORMANCE_API_TOKEN}" \
  "${FORMANCE_API_URL}/v2" | jq .
```

If `jq` is unavailable:

```bash
curl -sS \
  -H "Authorization: Bearer ${FORMANCE_API_TOKEN}" \
  "${FORMANCE_API_URL}/v2"
```

## 4) Write a test transaction

```bash
curl -sS -i -X POST \
  -H "Authorization: Bearer ${FORMANCE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  "${FORMANCE_API_URL}/v2/${FORMANCE_LEDGER}/transactions" \
  -d '{
    "reference": "bootstrap-smoke-001",
    "postings": [
      {
        "source": "world",
        "destination": "wallet:test-user",
        "amount": 100,
        "asset": "SERVICE_CREDITS"
      }
    ],
    "metadata": {
      "plugin": "service-credits",
      "flow": "bootstrap_smoke"
    }
  }'
```

## 5) Confirm transactions are present

```bash
curl -sS \
  -H "Authorization: Bearer ${FORMANCE_API_TOKEN}" \
  "${FORMANCE_API_URL}/v2/${FORMANCE_LEDGER}/transactions" | jq .
```

## 6) Common failure checks

- `401/403`: token mismatch between CTF runtime and Formance auth policy.
- `404` on ledger endpoints: ledger namespace not created yet.
- Connection refused/timeout: wrong host or not using Railway private host.
- Empty database after bootstrap: no transactions have been posted yet.

## Notes

- Do not run CTF SQL migrations against Formance Postgres.
- Formance manages its own schema lifecycle; CTF migrations are for the CTF database only.
