---
title: Mobile screens now live with real data
date: "2026-06-12"
excerpt: Mobile screens now show live data, plugin colors aligned, and TrustTransport validation hardened.
category: Updates
slug: Product-Update-2026-06-12-Mobile-Real-Data
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 12, 2026

## What Shipped

Mobile Questions chat, Stream, and Directory screens now connect to real server data. Before, these screens showed placeholder content. Now they pull live information so you can use them the way they're meant to work.

We also aligned every plugin accent color to match our design guide, so the interface looks consistent across the platform. TrustTransport settlement-price validation is now more robust, catching edge cases that could have caused issues.

A few more fixes:
- Wind-only reading endpoint is available at `/wind` for developers who want wind data separately
- CodeRabbit pacing job can now mark draft reviews as ready
- Expo Android preview builds are behind an opt-in label to keep CI clean
- Removed out-of-scope video content from TrustTransport trip thread

## Why It Matters

Real data means you can actually test workflows and trust what you see. Color consistency makes the interface easier to read and remember. Better validation prevents silent failures that waste time.
