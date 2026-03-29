#!/usr/bin/env bash
set -euo pipefail

required_env=("FORMANCE_API_URL" "FORMANCE_LEDGER" "FORMANCE_API_TOKEN")

for key in "${required_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "Missing required env var: $key"
    echo "Example: export FORMANCE_API_URL=http://ledger.railway.internal:8080"
    exit 1
  fi
done

BASE_URL="${FORMANCE_API_URL%/}"
LEDGER_NAME="${FORMANCE_LEDGER}"
AUTH_HEADER="Authorization: Bearer ${FORMANCE_API_TOKEN}"
REQUEST_ID="$(date +%s)"

if [[ "${BASE_URL}" == *".railway.internal"* ]]; then
  if ! getent hosts "${BASE_URL#http://}" >/dev/null 2>&1 && ! getent hosts "${BASE_URL#https://}" >/dev/null 2>&1; then
    echo "${BASE_URL} is a Railway private hostname and is not resolvable from this shell."
    echo "Use https://<service>.up.railway.app when running bootstrap locally, or run this script inside Railway runtime."
    exit 1
  fi
fi

echo "[1/4] Bootstrapping ledger namespace: ${LEDGER_NAME}"
bootstrap_status="$(curl -sS -o /tmp/formance-bootstrap-response.json -w "%{http_code}" \
  -X POST \
  -H "$AUTH_HEADER" \
  "${BASE_URL}/v2/${LEDGER_NAME}")"

bootstrap_body="$(cat /tmp/formance-bootstrap-response.json 2>/dev/null || true)"
already_exists_v2="false"
if [[ "$bootstrap_status" == "400" ]] && [[ "$bootstrap_body" == *"LEDGER_ALREADY_EXISTS"* ]]; then
  already_exists_v2="true"
fi

if [[ "$bootstrap_status" != "201" && "$bootstrap_status" != "409" && "$already_exists_v2" != "true" ]]; then
  echo "Bootstrap failed with HTTP ${bootstrap_status}"
  cat /tmp/formance-bootstrap-response.json
  exit 1
fi

if [[ "$bootstrap_status" == "201" ]]; then
  echo "Ledger namespace created."
elif [[ "$already_exists_v2" == "true" ]]; then
  echo "Ledger namespace already exists (HTTP 400 LEDGER_ALREADY_EXISTS)."
else
  echo "Ledger namespace already exists (HTTP 409)."
fi

echo "[2/4] Listing ledgers"
curl -sS \
  -H "$AUTH_HEADER" \
  "${BASE_URL}/v2" || true
echo

echo "[3/4] Posting smoke transaction"
curl -sS -o /tmp/formance-smoke-response.json -w "%{http_code}" \
  -X POST \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  "${BASE_URL}/v2/${LEDGER_NAME}/transactions" \
  -d "{\"reference\":\"bootstrap-smoke-${REQUEST_ID}\",\"postings\":[{\"source\":\"world\",\"destination\":\"wallet:test-user\",\"amount\":100,\"asset\":\"SERVICE_CREDITS\"}],\"metadata\":{\"plugin\":\"service-credits\",\"flow\":\"bootstrap_smoke\"}}" >/tmp/formance-smoke-status.txt

smoke_status="$(cat /tmp/formance-smoke-status.txt)"
if [[ "$smoke_status" != "200" && "$smoke_status" != "201" ]]; then
  echo "Smoke transaction failed with HTTP ${smoke_status}"
  cat /tmp/formance-smoke-response.json
  exit 1
fi

echo "[4/4] Fetching transactions"
curl -sS \
  -H "$AUTH_HEADER" \
  "${BASE_URL}/v2/${LEDGER_NAME}/transactions" || true
echo

echo "Formance Railway bootstrap + smoke completed successfully."
