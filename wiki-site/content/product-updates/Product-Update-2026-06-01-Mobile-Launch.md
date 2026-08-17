---
title: Mobile app, live audio rooms, and stability improvements
date: "2026-06-01"
excerpt: Mobile layouts for all plugins, live audio rooms in Chyme, and stability fixes.
category: Updates
slug: Product-Update-2026-06-01-Mobile-Launch
repo: chargingthefuture/chargingthefuture
---

# Product Update: Mobile Launch and Live Audio

**Date:** June 1, 2026

## What Shipped

We've made Charging the Future work on phones and tablets. Every plugin—Chyme, Feed, LightHouse, GDP, Directory, and SocketRelay—now has a mobile layout that adapts to smaller screens.

We also built the real Chyme live audio room. You can now join real-time audio conversations with other survivors, moving beyond the demo experience.

Behind the scenes, we've hardened the app: error reporting now works across all plugins, the Directory no longer crashes on certain data shapes, and chat messages save reliably regardless of targeting settings.

## Why It Matters

Mobile access removes friction. Survivors can access Charging the Future from anywhere—on a phone, tablet, or computer—without switching apps or restarting workflows.

Live audio in Chyme creates space for real-time connection and peer support. Text has its place, but voice conversations can build trust and community faster, especially when survivors need to process experiences together.

Stability work means fewer crashes, fewer lost messages, and fewer frustrations. A reliable platform is a respectful platform. You can focus on your goals, not on fixing broken features.

## Technical Details

- Added responsive phone layouts for all plugins
- Built Chyme audio room infrastructure with real-time streaming
- Integrated Sentry error reporting across plugins
- Fixed Directory response handling and Feed targeting logic
- Enforced plain-voice brand standards in code with automated checks

## Next

We're continuing to refine mobile performance and exploring ways to make Chyme's audio room even more accessible.
