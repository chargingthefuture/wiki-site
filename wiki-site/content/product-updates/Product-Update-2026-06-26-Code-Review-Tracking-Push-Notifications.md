---
title: Code review and push notifications now live
date: "2026-06-26"
excerpt: Code-review deduplication, Foundation push notifications on Android, and mobile display fixes.
category: Updates
slug: Product-Update-2026-06-26-Code-Review-Tracking-Push-Notifications
repo: chargingthefuture/chargingthefuture
---

# Product Update — June 26, 2026

## What Shipped

**Code-review sweep deduplication.** The code-review sweep now remembers which findings it has already reported. When the same issue appears again, it won't create a duplicate report — it'll tag the existing one and move on. This keeps your audit trail clean and saves time.

**Foundation instant-call push notifications on Android.** When someone tries to reach you through a Foundation instant-call on mobile, your phone now sends a native push notification. You'll see the ring notification even if the app isn't open.

**Code-review follow-up fixes.** Audit contexts, deletion timestamps, and mobile auth gates got corrected across the workforce code-review flow. Mobile public pages and teaser stats now display correctly.

## Why It Matters

The code-review sweep is built to catch issues over time. Deduplication means you're looking at actual new problems, not the same thing reported five times. That makes your audit easier to read and your fixes easier to track.

Push notifications on instant-call mean you're less likely to miss a message. The notification arrives whether or not you're in the app.

The fixes to timestamps, auth gates, and display states round out the code-review system so it works as intended across all surfaces.

---

Code lives at https://github.com/chargingthefuture/chargingthefuture
