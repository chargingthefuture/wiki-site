---
title: Currency selector in TrustTransport
date: "2026-06-12"
excerpt: TrustTransport now lets you choose settlement currency, and we fixed dependency syncing across the codebase.
category: Updates
slug: Product-Update-2026-06-12-TrustTransport-Currency-Selector
repo: chargingthefuture/chargingthefuture
---

# Product Update: June 12, 2026

## What Shipped

TrustTransport's "Book a Ride" feature now includes a currency selector. When you're setting up a settlement value type, you can choose which currency to use. This gives you more control over how you name and track your transactions.

We also synced our dependency files across the codebase so mobile and root packages stay in step with each other. This fixes occasional drift issues that could cause builds to act unexpectedly.

## Why It Matters

Currency selection in TrustTransport means your settlements match how you actually work and get paid. No more forcing transactions into a currency that doesn't fit your situation.

The dependency sync keeps our CI pipeline reliable and predictable. When things are stable behind the scenes, you get faster builds and fewer surprise failures.
