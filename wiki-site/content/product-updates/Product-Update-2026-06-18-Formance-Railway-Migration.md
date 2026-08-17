---
title: Formance ledger now runs on Railway
date: "2026-06-18"
excerpt: Formance ledger moved to Railway for lower costs and more reliable backups.
category: Updates
slug: Product-Update-2026-06-18-Formance-Railway-Migration
repo: chargingthefuture/chargingthefuture
---

# Formance Ledger Migration to Railway

## What Shipped

The Formance ledger now runs on Railway instead of Render. We also updated the backup and restore workflows to use Railway's Postgres database.

The entrypoint script now reliably bootstraps itself when the ledger starts, and the build process rebuilds the image when the entrypoint changes — not just when the Dockerfile changes.

## Why It Matters

Running on Railway reduces hosting costs. The backup and restore workflows are simpler now that they point at one database. The bootstrapping fix means the ledger starts cleanly every time, with no manual intervention needed.

Code lives at https://github.com/chargingthefuture/chargingthefuture.
