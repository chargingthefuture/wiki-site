#!/usr/bin/env bash
set -euo pipefail

pnpm -C "$(dirname "$0")/.." run lint
