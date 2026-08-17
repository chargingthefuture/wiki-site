---
title: Foundation Direct Line and profile edits now live
date: "2026-06-24"
excerpt: Foundation quote requests now include Direct Line chat. Members can edit their own directory profiles.
category: Updates
slug: Product-Update-2026-06-24-Foundation-Direct-Line
repo: chargingthefuture/chargingthefuture
---

# Foundation Direct Line and Profile Self-Edit

## What Shipped

Foundation quote requests now come with a Direct Line chat. When you request a quote from a service provider, you get a one-to-one chat paired with that transaction. You can ask questions, clarify details, or share context without switching windows or waiting for another message channel.

Members can now edit their own directory profile. You don't need to contact the operator to update your name, bio, location, or skills. Log in, find your profile, and change what you want. The directory reflects your updates right away.

Cleaned up some Foundation surfaces too: removed a fake "Chat" tab that wasn't real, dropped an incorrect claim about Service Credits, and fixed errors in the quote request flow.

## Why It Matters

Direct communication with a provider before booking makes the whole process clearer. You get answers fast and can decide with confidence.

Managing your own profile means you own how you present yourself to the network. Updates happen on your schedule, not on someone else's.

## Technical Notes

- Foundation Direct Line uses the same Direct Line chat surface as LightHouse, SocketRelay, and TrustTransport matches.
- Service Credits reclaim now sweeps automatically when accounts are deleted, preventing orphaned credits.
- Quora port fixed to skip fully-deleted accounts and port only v2-approved users.
