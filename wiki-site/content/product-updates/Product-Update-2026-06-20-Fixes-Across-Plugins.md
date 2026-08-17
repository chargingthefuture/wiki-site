---
title: Fixes to LightHouse, Chyme, and Unlock
date: "2026-06-20"
excerpt: Fixes to LightHouse currencies and editing, Chyme audio rooms, and platform stability.
category: Updates
slug: Product-Update-2026-06-20-Fixes-Across-Plugins
repo: chargingthefuture/chargingthefuture
---

## What Shipped

**LightHouse currency support**: Property listings now let you set prices in multiple currencies. If you're listing a space, you can choose the currency that works for your location.

**LightHouse self-editing**: Members can now edit their own listing instead of having to apply to edit it. You own your listing — you should be able to change it without extra steps.

**Chyme raise-hand persistence**: When you raise your hand in a Chyme audio room, that hand stays raised if you switch between different rooms. The system no longer drops your hand state.

**Unlock submission URLs**: Unlock admins can now edit a submission's Quora profile URL field directly.

**Mobile display fixes**: The Survivor Hub title and logo no longer appear truncated or cut off in the mobile top bar.

**Service Credits stability**: Added missing database indexes so Service Credits minting works reliably when the system processes multiple requests at the same time.

## Why It Matters

These changes make the core tools work the way you'd expect. You can list property in your local currency. You control your own listing without friction. Audio rooms remember your state. Admins have the tools they need. The mobile experience is cleaner. And the backend infrastructure stays stable as the platform grows.

The code is at https://github.com/chargingthefuture/chargingthefuture.
