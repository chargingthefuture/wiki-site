---
title: Chat composer and GPU setup improvements
date: "2026-06-14"
excerpt: Mobile fixes, external GPU support, and faster @comic drafts via RunPod serverless.
category: Updates
slug: Product-Update-2026-06-14-Chat-and-GPU-Improvements
repo: chargingthefuture/chargingthefuture
---

# Product Update: Chat and GPU Improvements

## What Shipped

**Mobile chat composer fix.** The hint text in the @comic composer was showing up twice on mobile. That's fixed now.

**External GPU support for Ollama.** If you have a GPU on a separate machine, you can now tell Ollama where it is. Point the app at your external host and it'll use that hardware instead of running everything locally.

**Faster @comic drafts with RunPod.** We added support for RunPod serverless endpoints. When you ask @comic for a draft, it can now talk to RunPod for faster processing instead of only using local compute.

**Cleaner banned-word list.** We consolidated our word checks into a single voice hook, making it easier to maintain and update over time.

**Ollama-only @comic.** We removed the Rasa NLU integration. The composer now uses Ollama exclusively.

## Why It Matters

Small friction points add up. Fixing the mobile composer hint removes one more thing that felt off. External GPU support and RunPod endpoints mean you can choose what speed and cost tradeoff makes sense for your setup—you're not locked into one path. The code is cleaner now too, which means we can fix bugs and add features faster going forward.
