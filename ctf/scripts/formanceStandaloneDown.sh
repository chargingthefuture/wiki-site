#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/ops/formance/upstream-standalone/docker-compose.yml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "No standalone compose file found at $COMPOSE_FILE"
  echo "Run: pnpm -C $ROOT_DIR run formance:fetch:standalone"
  exit 1
fi

docker compose -f "$COMPOSE_FILE" down
