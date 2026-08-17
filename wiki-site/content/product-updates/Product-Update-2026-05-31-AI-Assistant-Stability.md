---
title: AI Assistant improvements and platform stability updates
date: "2026-05-31"
excerpt: AI Assistant now understands language better, with improved stability across the platform.
category: Updates
slug: Product-Update-2026-05-31-AI-Assistant-Stability
repo: chargingthefuture/chargingthefuture
---

# Product Update: AI Assistant Improvements & Platform Stability

**Date:** May 31, 2026

## What Shipped

- **Rasa NLU Service**: Added natural language understanding to the AI Assistant, enabling more accurate interpretation of your questions and requests.
- **Rate Limiting**: Implemented intelligent rate limiting to ensure consistent performance during peak usage.
- **Stability Fixes**: Resolved crash-loop issues in the platform maintenance service and synchronized dependency updates across the system.
- **Code Quality**: Enforced plain language standards in all agent communication, ensuring clarity in system responses.

## Why It Matters

The AI Assistant is a core part of how you access support and information on Charging the Future. By improving its language understanding, we help you communicate naturally without having to guess the "right" phrasing. The stability fixes mean fewer interruptions and a more reliable experience as you work through the platform.

We're committed to building tools that work consistently and speak to you in clear, jargon-free language—because you deserve support that's easy to understand and trust.

## Technical Details

- Rasa NLU integration for enhanced conversational capabilities
- Rate limiting on NLU calls to maintain system performance
- Removal of problematic service from production deployment
- Dependency synchronization for OpenFeature/Unleash integration
