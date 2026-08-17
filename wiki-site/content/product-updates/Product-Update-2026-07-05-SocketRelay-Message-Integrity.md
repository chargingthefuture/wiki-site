---
title: SocketRelay messages now stay intact on retry
date: "2026-07-05"
excerpt: SocketRelay messages now preserve their original text during retries.
category: Updates
slug: Product-Update-2026-07-05-SocketRelay-Message-Integrity
repo: chargingthefuture/chargingthefuture
---

# SocketRelay Message Integrity Fix

## What Shipped

Fixed a bug in SocketRelay where message text could be altered during idempotent retries. When a SocketRelay request needed to be sent again, the original message content is now preserved exactly as written.

## Why It Matters

Your words matter. When you send a message through SocketRelay to connect with someone, that message should arrive unchanged. This fix ensures your message stays exactly as you wrote it, no matter how many times the system needs to deliver it safely.
