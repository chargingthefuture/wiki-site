---
title: Blog publishing is now faster and more reliable
date: "2026-05-29"
excerpt: Blog publishing is now faster and more reliable
category: Updates
slug: Product-Update-2026-05-29-Blog-Publishing-Infrastructure
repo: chargingthefuture/chargingthefuture
---

# Blog Publishing Infrastructure Update

## What Shipped

We've restructured how the wiki-blog content deploys to our public site. Previously, blog publishing relied on a fragmented pipeline that could create delays and inconsistencies. We've now unified the deployment process so that wiki-blog content flows directly from our main codebase to the live site through a single, dedicated channel.

This means:

- **Faster publication**: Educational articles and community stories publish with fewer intermediate steps
- **Fewer moving parts**: A streamlined CI/CD pipeline reduces points of failure
- **Clearer status**: Our deployment logs are now easier to audit, making troubleshooting faster if issues arise

## Why It Matters

For survivors building skills and knowledge, every day matters. When we publish a new resource on critical thinking, digital safety, or economic resilience, we want it live and accessible to you without unnecessary delay. A faster, more reliable publishing pipeline means we can respond more quickly to community needs and get educational content into your hands when you need it.

This is infrastructure work—unsexy but essential. It's part of our commitment to predictability and transparency in how we operate.

## Technical Details

We've consolidated the wiki-site submodule deployment to initialize only the blog-specific content during Pages builds, eliminating redundant processing steps and creating a cleaner handoff from our main repository to the published site.

