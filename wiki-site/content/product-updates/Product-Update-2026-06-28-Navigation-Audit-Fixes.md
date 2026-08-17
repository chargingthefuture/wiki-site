---
title: Back button added, audit fixes, and mobile improvements
date: "2026-06-28"
excerpt: Back button navigation standardized across all screens; LightHouse audit tracking and data field fixes merged.
category: Updates
slug: Product-Update-2026-06-28-Navigation-Audit-Fixes
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 28, 2026

## What Shipped

Added a uniform back button across all app and admin screens that works on mobile and desktop. Fixed LightHouse admin audit event fields to track correctly. Updated service-credit escrow release tracking to use the right user ID field. Added a weekly performance data endpoint for export. Fixed some code in Directory and SocketRelay based on review feedback.

## Why It Matters

Navigation is easier when the back button works the same everywhere you go. The audit fixes mean LightHouse matches get tracked accurately, which matters if you need records of what happened. The data fixes keep the system consistent—each field now points to the right thing.

## Technical Details

- Uniform mobile-responsive back button across app and admin screens (#1176)
- LightHouse admin audit event fields completed (#1174)
- Weekly performance week.get route and export contract reconciled (#1175)
- Service-credits escrow-release destinationUserId field reconciled (#1173)
- Directory and SocketRelay code-review findings resolved (#1166, #1165)
- Workflow naming updated for clarity

Find the code at https://github.com/chargingthefuture/chargingthefuture
