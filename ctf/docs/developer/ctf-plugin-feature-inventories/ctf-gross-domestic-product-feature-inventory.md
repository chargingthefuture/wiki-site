# Gross Domestic Product Plugin Feature Inventory (CTF Rewrite)

## Scope

- Rewrite target only: `ctf/`
- Legacy reference excluded from implementation: `platform/`
- Plugin name: `Gross Domestic Product`
- Plugin slug / service key: `gross-domestic-product`
- Primary mission scope:
  - provide public-facing GDP transparency for the survivor community,
  - track shared service-economy progress with canonical metrics,
  - support survivor-led governance through auditable KPI definitions,
  - avoid fabricated or ambiguous metrics via canonical metric registry enforcement.

## Intent and Outcome

The Gross Domestic Product plugin is a trauma-informed, transparency-first economics plugin for survivors to:

1. view total and per-capita GDP progress,
2. inspect service-sector and goods/local-economy composition,
3. monitor provider participation and earning opportunity trends,
4. understand progress against the 5-year rollout milestones,
5. trust reported values through auditable canonical metric contracts.

The plugin must provide equivalent core behavior across web and Android, with phased parity tracked and closed before GA.

---

## 1) Planned User-Facing Features

### 1.1 GDP Transparency Overview

1. Public survivor-facing GDP summary dashboard.
2. Current annual `Total GDP`, `Service GDP`, `Goods/Local GDP` with plain-language explanations.
3. Per-capita indicators based on population baseline and selected period.
4. Progress-to-target indicators for $300B total and $210B services goals.

### 1.2 Service Category Composition

1. Service breakdown by category:
   - personal and social care,
   - professional and knowledge services,
   - platforms and marketplaces,
   - creative and cultural,
   - maintenance and utilities.
2. Category share and absolute value displays.
3. Year-over-year change visibility by category.
4. Footnotes linking each category to canonical metric IDs.

### 1.3 Provider Participation and Unit Economics

1. Active provider counts and participation rate.
2. Blended and tiered hourly-rate trend views.
3. Billable hours and revenue by provider tier:
   - high-value specialists,
   - mid-value professionals,
   - low-value/microservice providers.
4. Transparent assumptions panel for scenario interpretation.

### 1.4 Five-Year Rollout Tracking

1. Year-by-year target and actual views for service GDP capture.
2. Milestone tracking for provider growth and specialist certification targets.
3. Gap-to-target indicators for each year and category.
4. Backfilled timeline display for prior years once data is available.

### 1.5 Data Quality and Trust Cues

1. Metric freshness indicators (`last_updated`, update cadence).
2. Canonical-definition status indicator per KPI.
3. Clear handling for unresolved/blocked metrics (not found/ambiguous).
4. Human-readable metric definition panel (name, owner, formula summary).

---

## 2) Planned Admin Features

### 2.1 Metric Governance Operations

1. Canonical metric lifecycle management (proposal/review/approval).
2. Alias and naming conflict resolution workflow.
3. Ownership and stewardship tracking for each KPI.

### 2.2 Data Pipeline and Model Operations

1. Controlled publishing of GDP snapshots.
2. Validation queue for failed metric checks.
3. Backfill and replay controls for historical periods.

### 2.3 Policy and Compliance Operations

1. Access controls for administrative metric mutation commands.
2. Full audit trail for metric definition and publish actions.
3. Data retention and legal basis review for metric inputs.

---

## 3) API Surface and Route Map (Planned)

## 3.1 Plugin Command Surface (Authoritative)

All command contracts must conform to templates from:

- `201-plugin-command-schema-template.mdc`
- `202-plugin-access-policy-schema-template.mdc`
- `203-plugin-audit-schema-template.mdc`

Planned command groups:

1. `gross-domestic-product.metrics.list`
2. `gross-domestic-product.metrics.get`
3. `gross-domestic-product.dashboard.snapshot.get`
4. `gross-domestic-product.rollout.progress.get`
5. `gross-domestic-product.scenario.assumptions.get`
6. `gross-domestic-product.admin.metric.propose`
7. `gross-domestic-product.admin.metric.approve`
8. `gross-domestic-product.admin.snapshot.publish`
9. `gross-domestic-product.admin.backfill.run`

### 3.2 HTTP Projection Routes (Planned)

User routes:

- `GET /api/gross-domestic-product/metrics`
- `GET /api/gross-domestic-product/metrics/:metricId`
- `GET /api/gross-domestic-product/dashboard/snapshot`
- `GET /api/gross-domestic-product/rollout/progress`
- `GET /api/gross-domestic-product/scenario/assumptions`

Admin routes:

- `POST /api/gross-domestic-product/admin/metrics/proposals`
- `POST /api/gross-domestic-product/admin/metrics/:metricId/approve`
- `POST /api/gross-domestic-product/admin/snapshots/publish`
- `POST /api/gross-domestic-product/admin/backfill`
- `GET /api/gross-domestic-product/admin/audit-events`

---

## 4) Data Model and Storage Contracts (Planned)

### 4.1 Canonical Profile and Plugin Extension

Must follow single-profile rule:

1. Reuse canonical user profile for identity and access context.
2. Add plugin extension data linked by `user_id` only where required.
3. Do not introduce a standalone GDP profile duplicating canonical fields.

Planned extension entity:

- `gdp_user_extension`
  - `user_id`
  - display preferences for GDP views,
  - locale/unit preferences,
  - accessibility preferences,
  - notification preferences for GDP update events.

### 4.2 Domain Entities

Planned domain tables (initial set):

1. `gdp_metric_snapshots`
2. `gdp_category_breakdowns`
3. `gdp_provider_tier_snapshots`
4. `gdp_rollout_targets`
5. `gdp_rollout_actuals`
6. `gdp_metric_definition_events`
7. `gdp_publish_events`

### 4.3 Lifecycle and Storage Constraints

1. Immutable history for published snapshots.
2. Versioned metric definition changes with compatibility notes.
3. Deterministic source links from dashboard tiles to canonical metric IDs.
4. Retention metadata captured per domain entity.

---

## 5) Security, Privacy, and Compliance Controls (Planned)

1. Server-side authorization for every command execution.
2. Deny-by-default administrative command access.
3. Mandatory canonical metric check before metric-dependent changes.
4. Audit events for allow + deny decisions on GDP admin commands.
5. No sensitive raw payload values in audit logs.
6. Explicit versioning for breaking metric/schema changes.

---

## 6) Web and Android Parity Plan (Planned)

1. Core read-only GDP transparency flows are parity-required.
2. Administrative mutation capabilities may ship web-first with tracked Android parity backlog.
3. KPI definitions, semantics, and values must be identical across platforms.
4. Any deferred parity requires owner, due date, and risk note.

---

## 7) UX Direction and Interaction Notes (Planned)

1. Data-dense but plain-language economics UI for broad accessibility.
2. High contrast, low-cognitive-load visual hierarchy.
3. No manipulative urgency patterns or scarcity framing.
4. Transparent assumptions and caveats near every high-impact figure.

---

## 8) Test and Seed Coverage Status (Planned)

1. Contract tests for GDP command schemas.
2. Access policy tests for admin vs public command surfaces.
3. Audit integrity tests for all GDP mutation commands.
4. Integration tests for snapshot publish + retrieval flows.
5. Deterministic seed scenarios for 5-year GDP rollout examples.

---

## 9) Gaps, Ambiguities, and Technical Debt (Current)

1. Final ownership assignments for economics metrics are pending.
2. Regional/legal constraints for public GDP publication need confirmation.
3. Snapshot publication SLA and freeze windows are not finalized.
4. Migration/version strategy for metric definition evolution requires first implementation RFC.

---

## 10) Change Log

- 2026-02-24: Initial GDP CTF rewrite inventory created.
