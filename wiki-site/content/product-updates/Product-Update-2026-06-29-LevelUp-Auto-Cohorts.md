---
title: LevelUp now auto-builds training cohorts from workforce gaps
date: "2026-06-29"
excerpt: LevelUp auto-creates training cohorts from workforce gaps; Workforce snapshot now live and accurate.
category: Updates
slug: Product-Update-2026-06-29-LevelUp-Auto-Cohorts
repo: chargingthefuture/chargingthefuture
---

# Product Update: LevelUp Auto-Cohorts and Workforce Live Snapshot

**Date:** June 29, 2026

## What Shipped

LevelUp now auto-creates training cohorts based on live Workforce gaps. When the platform detects a skill shortage in your Workforce snapshot, it spins up a cohort to fill it—no manual setup needed.

The LevelUp Browse page got a cleanup: removed a dead Create button, dropped the duplicate balance display, and swapped static track chips for dynamic ones that stay current.

The public Workforce landing page now shows a live snapshot of your community—real recruited counts from active Directory profiles, sector gaps labeled clearly, and ServiceCredits earn/spend lists that reflect actual transactions.

## Why It Matters

Training cohorts exist to solve real gaps. Watching Workforce data and spinning up cohorts hands-free means your community doesn't wait for someone to notice a need and build a response manually. Survivors get matched to skills training faster, and the platform adapts to what the group actually needs.

Cleaner UI and live data mean you see your community's true shape—who's active, where the gaps are, what's moving. That clarity lets you plan and respond with real information, not guesses.

## Technical Notes

- Auto-cohort logic runs on a scheduled workflow; manual cohort creation still works alongside it.
- Recruited counts now pull from active Directory profiles instead of login events, so the picture is more accurate.
- The Workforce snapshot and ServiceCredits public pages now refresh on a live schedule, not cached.
- Back button position on unauthenticated plugin landing pages was corrected.
- Mobile top chrome now rolls out across all plugin and admin shells, with the account hub link in the apps launcher.
- vitest bumped to 3.2.6 to clear a security advisory.

Code: https://github.com/chargingthefuture/chargingthefuture
