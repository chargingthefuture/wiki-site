---
title: Chat refresh, mobile fixes, and error logging
date: "2026-06-15"
excerpt: Chat refresh on mobile, Add location feedback, and error logging improvements ship this week.
category: Updates
slug: Product-Update-2026-06-15-Mobile-Fixes-And-Chat-Refresh
repo: chargingthefuture/chargingthefuture
---

# Product Update: Mobile Fixes and Chat Refresh

**Date:** June 15, 2026

## What Shipped

We merged six fixes and improvements to Charging the Future this week.

**On mobile, Chyme chat now sits on the Join Room row.** This puts the refresh button where it's easier to reach on smaller screens.

**The Add location button now gives you feedback.** When you tap it, you'll see what happened instead of wondering if it worked.

**Error logging is clearer.** When something goes wrong, we now write errors to stdout so we can see them in Render logs. That means faster fixes when problems show up.

**Design colors are locked in.** We aligned the standard-theme plugin colors to match our canonical design table, so the look stays consistent.

**ServiceCredits send panel is now full-width on mobile.** No more cramped layouts when you're sending credits from your phone.

**ClickLog works in production.** We registered it in the plugin registry so it's available for everyone, not just in testing.

## Why It Matters

These are small, practical fixes. They make the platform work better on the devices you actually use, give you clearer feedback when you take action, and help us spot and fix problems faster. Steady platforms let you focus on what matters to you.
