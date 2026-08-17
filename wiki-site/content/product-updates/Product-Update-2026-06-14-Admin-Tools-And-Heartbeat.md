---
title: Admin tools, heartbeat fixes, and Skills Hunt updates
date: "2026-06-14"
excerpt: Admin account and job listing controls, Chyme chat optimization, and Skills Hunt badge removal.
category: Updates
slug: Product-Update-2026-06-14-Admin-Tools-And-Heartbeat
repo: chargingthefuture/chargingthefuture
---

# Product Update — June 14, 2026

## What Shipped

We merged four changes to the main branch:

- **TrustTransport admin controls**: Admins can now restrict and restore accounts directly in the platform.
- **Workforce admin tools**: Admins can create, read, update, and delete occupations and announcements.
- **Chyme chat database optimization**: The presence heartbeat (the signal that keeps chat connected) now uses less database resources when idle, which cuts costs.
- **Skills Hunt badge removal**: The Alpha badge is no longer displayed on Skills Hunt.

## Why It Matters

Admins have clearer tools to manage accounts and job postings without leaving the platform. The lighter heartbeat means the system runs more efficiently without changing how chat works for you. Skills Hunt is out of alpha and ready to use without the label.

## Code

All changes are available at https://github.com/chargingthefuture/chargingthefuture
