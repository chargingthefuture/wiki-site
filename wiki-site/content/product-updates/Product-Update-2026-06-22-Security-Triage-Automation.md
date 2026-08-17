---
title: Security checks now run weekly, findings go to triage
date: "2026-06-22"
excerpt: Weekly security findings now automatically surface to triage; backup and database configuration simplified.
category: Updates
slug: Product-Update-2026-06-22-Security-Triage-Automation
repo: chargingthefuture/chargingthefuture
---

# Security Triage Automation

## What Shipped

Three infrastructure updates landed on main:

**Weekly security findings triage**: A scheduled job now runs once a week to surface open security findings into a private triage issue. This keeps potential vulnerabilities visible and tracked without requiring manual review.

**Simplified backup configuration**: Removed fallback dual-source secrets from the Formance backup and restore process. The system now uses a single, clear configuration path.

**Supabase and Unlock fixes**: Added a keepalive mechanism to prevent Supabase free-tier databases from pausing due to inactivity. Fixed the Unlock reconciliation cron to read the existing `NEXT_PUBLIC_APP_URL` directly instead of maintaining separate configuration.

## Why It Matters

These changes reduce operational friction and improve reliability. Weekly triage automation means security findings get reviewed on a consistent schedule without manual intervention. Simpler configuration paths mean fewer places for errors to hide, and the keepalive and cron fixes prevent unexpected service interruptions that could disrupt member access.

The code is at https://github.com/chargingthefuture/chargingthefuture.
