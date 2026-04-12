# CTF Economic Models Feature Inventory

**Plugin Slug:** economic-models
**Location:** ctf/packages/economic-models
**Inventory Type:** CTF Rewrite

---

## Scope and Plugin Boundary
- Provides three economic interdependence measurement modules (Hierarchical Network, Geopolitical, Input-Output/Trade Linkage).
- Consumes anonymized, aggregated event data from DB/plugins.
- Exposes REST API and dashboard-ready outputs.
- Strictly privacy-preserving; no PII processed.

## Implemented User Features
- API endpoints for retrieving per-user, per-community, and global interdependence scores.
- Human-readable explanations and uncertainty/confidence metrics for each score.
- Dashboard-ready data for time-series, heatmaps, and network graphs.

## Implemented Admin Features
- Automated backtesting and A/B module comparison endpoints (planned).
- Statistical drift detection and validation outputs (planned).
- ETL pipeline for data extraction, transformation, and anonymization.

## API Surface and Route Map
- `POST /api/economic-models/network/scores` — Network module analysis
- `POST /api/economic-models/geopolitical/scores` — Geopolitical module analysis
- `POST /api/economic-models/input-output/scores` — Input-Output module analysis

## Data Model and Storage Contracts
- See `schemas.ts` for anonymized record formats:
  - TransactionRecord
  - RegionalFlowRecord
  - InputOutputRecord
- All data is anonymized and aggregated before analysis.
- No raw PII is stored or processed by this plugin.

## Changelog / Deprecations
- Initial inventory created (2026-03-31).

---

*This inventory must be updated with every feature addition, removal, or behavioral change per 120-plugin-feature-inventory-lifecycle-rules.mdc.*
