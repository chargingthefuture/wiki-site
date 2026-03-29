# GentlePulse Plugin Feature Inventory (Legacy Reference)

## Scope
- Source analyzed (reference-only): `platform/`
- Rewrite target: `ctf/`
- Plugin name to retain: `GentlePulse`
- Guardrail honored: no edits in `platform/` (per `.claude/rules/index.mdc` and `099-agent-scope-guardrails.mdc`)

---

## Executive Summary
`GentlePulse` is a meditation library plugin centered on anonymous usage patterns via client-scoped identifiers (not user profile identity). Core behavior includes:
- meditation browsing with sorting/tag filters,
- play tracking,
- anonymous ratings and favorites,
- in-app announcements,
- mood-check integration (from Mood plugin endpoints),
- accessibility personalization settings,
- admin-facing meditation and announcement management UIs.

This document captures full discovered scope from legacy code and flags key implementation mismatches to resolve during ctf rewrite.

---

## 1) User-Facing Features

### 1.1 Library Dashboard
Evidence:
- `platform/client/src/pages/gentlepulse/library.tsx`
- `platform/server/routes/gentlepulse.routes.ts`

Features:
1. Library route: `/apps/gentlepulse`.
2. Meditation list retrieval with server pagination (`limit`, `offset`).
3. Sort modes: `newest`, `most-rated`, `highest-rating`.
4. Tag filter (`tag` query parameter).
5. Favorites-only toggle:
   - loads all meditations client-side when enabled,
   - filters by anonymous favorite IDs.
6. Announcement banner integration (`/api/gentlepulse/announcements`).
7. Desktop sub-navigation (Library, Support, Settings).
8. Mood-check eligibility check and dialog trigger (once per session if eligible).
9. Pagination controls rendered for library/favorites lists.

### 1.2 Meditation Card Interactions
Evidence:
- `platform/client/src/components/gentlepulse/meditation-card.tsx`
- `platform/server/routes/gentlepulse.routes.ts`

Features:
1. Display meditation metadata:
   - title,
   - description,
   - tags,
   - duration,
   - aggregate rating and count.
2. Play action:
   - increments server play count (`POST /api/gentlepulse/meditations/:id/play`),
   - opens Wistia URL externally.
3. Star rating action (1–5):
   - stores/updates anonymous client rating (`POST /api/gentlepulse/ratings`),
   - refreshes aggregate rating displays.
4. Favorite toggle action:
   - add favorite (`POST /api/gentlepulse/favorites`),
   - remove favorite (`DELETE /api/gentlepulse/favorites/:meditationId?clientId=...`),
   - toast feedback and cache refresh.

### 1.3 Announcements (User View)
Evidence:
- `platform/client/src/pages/gentlepulse/announcements.tsx`
- `platform/client/src/pages/gentlepulse/library.tsx`
- `platform/server/routes/gentlepulse.routes.ts`

Features:
1. Announcements route: `/apps/gentlepulse/announcements`.
2. Reads active, non-expired announcements.
3. Displays title/content/type/createdAt/expiresAt via shared `AnnouncementDisplay`.
4. Empty-state handling when no announcements exist.

### 1.4 Support Page
Evidence:
- `platform/client/src/pages/gentlepulse/support.tsx`

Features:
1. Support/About route: `/apps/gentlepulse/support`.
2. Static trauma-informed app description.
3. Privacy statement emphasizing anonymous and aggregated data usage.

### 1.5 Settings and Accessibility Personalization
Evidence:
- `platform/client/src/pages/gentlepulse/settings.tsx`
- `platform/client/src/index.css`

Features:
1. Settings route: `/apps/gentlepulse/settings`.
2. Local settings persistence (`localStorage` key `gentlepulse_settings`).
3. Toggles/selectors for:
   - high contrast mode,
   - font size (`normal`, `large`, `extra-large`),
   - dyslexia-friendly font.
4. Runtime application of CSS class toggles on `document.documentElement`.
5. Announcements CTA from settings page.

---

## 2) Anonymous Identity and Privacy Model

Evidence:
- `platform/client/src/hooks/useClientId.ts`
- `platform/shared/schema/gentlepulse/index.ts`
- `platform/server/routes/gentlepulse.routes.ts`

Implemented model:
1. Client-generated `clientId` persisted in local storage (`gentlepulse_client_id`).
2. Ratings/favorites keyed by `clientId`, not `userId`.
3. Server route helper strips IP and request metadata before handling GentlePulse requests.
4. Ratings endpoint exposes only aggregate average/count in read endpoint.

Note:
- UI routes are protected (`/apps/gentlepulse/*` in `plugin-routes.tsx`), but primary GentlePulse APIs are implemented as public/anonymous handlers. This is a design mismatch to resolve in ctf.

---

## 3) Mood Plugin Integration Used by GentlePulse

Evidence:
- `platform/client/src/pages/gentlepulse/library.tsx`
- `platform/client/src/components/mood/mood-check-dialog.tsx`
- `platform/server/routes/mood.routes.ts`

Features used by GentlePulse:
1. Eligibility check endpoint: `GET /api/mood/checks/eligible?clientId=...`.
2. Mood submission endpoint: `POST /api/mood/checks`.
3. Mood dialog appears when eligible and not shown in current session.
4. Submission callback can trigger safety message behavior based on backend response (`showSafetyMessage`).
5. Backend eligibility rule: once every 7 days.

---

## 4) Admin Features (UI + Backing State)

### 4.1 Admin Navigation and Surfaces
Evidence:
- `platform/client/src/pages/gentlepulse/admin.tsx`
- `platform/client/src/routes/plugin-routes.tsx`

Features:
1. Admin route: `/apps/gentlepulse/admin`.
2. Embedded meditation management section.
3. Announcement management CTA to `/apps/gentlepulse/admin/announcements`.

### 4.2 Admin Meditation Management UI
Evidence:
- `platform/client/src/pages/gentlepulse/admin-meditations.tsx`
- `platform/shared/schema/gentlepulse/index.ts`

Features:
1. Form-backed create/edit UI for meditation records.
2. Fields managed:
   - title,
   - description,
   - wistiaUrl,
   - thumbnail,
   - duration,
   - position,
   - tags,
   - isActive.
3. Existing meditation list with edit action.
4. Uses zod schema-based validation from shared schema.

### 4.3 Admin Announcement Management UI
Evidence:
- `platform/client/src/pages/gentlepulse/admin-announcements.tsx`

Features:
1. Create/update/deactivate announcement UI.
2. Fields: title, content, type, optional expiration date.
3. Types supported: `info`, `warning`, `maintenance`, `update`, `promotion`.
4. Shows active/inactive status and created date.
5. Cache invalidation for both user and admin announcement queries.

Important gap:
- GentlePulse admin UI calls `/api/gentlepulse/admin/*` endpoints, but these endpoints are not present in `platform/server/routes/gentlepulse.routes.ts` (see gaps section).

---

## 5) API Surface (Implemented in Server Routes)

Evidence: `platform/server/routes/gentlepulse.routes.ts`

| Endpoint | Auth Guard | Limiter | Purpose |
|---|---|---|---|
| `GET /api/gentlepulse/announcements` | None | None | Active/valid announcements |
| `GET /api/gentlepulse/meditations` | None | `publicListingLimiter` | Paginated meditation list with filters |
| `GET /api/gentlepulse/meditations/:id` | None | None | Meditation detail |
| `POST /api/gentlepulse/meditations/:id/play` | None | None | Increment play count |
| `POST /api/gentlepulse/ratings` | None | `publicItemLimiter` | Create/update anonymous rating |
| `GET /api/gentlepulse/meditations/:id/ratings` | None | None | Aggregate rating summary |
| `POST /api/gentlepulse/favorites` | None | None | Add anonymous favorite |
| `DELETE /api/gentlepulse/favorites/:meditationId` | None | None | Remove anonymous favorite (requires `clientId` query) |
| `GET /api/gentlepulse/favorites` | None | None | Return meditation IDs favorited by `clientId` |
| `GET /api/gentlepulse/favorites/check` | None | None | Check single favorite status |

Observed implementation notes:
1. `stripIPAndMetadata` is called for all GentlePulse route handlers.
2. Ratings are validated to integer range 1–5.
3. Favorites endpoint throws validation errors when `clientId` is missing.

---

## 6) Data Model and Storage Behaviors

Evidence:
- `platform/shared/schema/gentlepulse/index.ts`
- `platform/server/storage/plugins/gentlepulse-storage.ts`
- `platform/schema.sql`

### 6.1 Meditations
Fields:
- id, title, description, thumbnail, wistiaUrl, tags, duration,
- playCount, averageRating, ratingCount,
- position, isActive, createdAt, updatedAt.

Storage behaviors:
1. Tags are stored as JSON string in text field.
2. Supports filtered/sorted list retrieval with total count.
3. Play count is incremented atomically in DB update.

### 6.2 Ratings
Fields:
- id, meditationId, clientId, rating, createdAt.

Storage behaviors:
1. Upsert-like logic by `(clientId, meditationId)`.
2. Recomputes meditation `averageRating` and `ratingCount` after each write.

### 6.3 Favorites
Fields:
- id, meditationId, clientId, createdAt.

Storage behaviors:
1. Add/remove by `clientId` + `meditationId`.
2. Check endpoint for single-item favorite state.

### 6.4 Announcements
Fields:
- id, title, content, type, isActive, expiresAt, createdAt, updatedAt.

Storage behaviors:
1. Active announcement query filters expired records out.
2. Delete semantics are implemented as deactivation (`isActive=false`).

---

## 7) Route Inventory (Client)

Evidence: `platform/client/src/routes/plugin-routes.tsx`

Authenticated UI routes:
1. `/apps/gentlepulse` (library)
2. `/apps/gentlepulse/support`
3. `/apps/gentlepulse/settings`
4. `/apps/gentlepulse/admin`
5. `/apps/gentlepulse/admin/announcements`
6. `/apps/gentlepulse/announcements`

---

## 8) Seed and Operational Data

Evidence:
- `platform/scripts/seedGentlePulse.ts`
- `platform/scripts/seedAllPlugins.ts`

Seeded scope:
1. Meditation catalog entries with tags/duration/order.
2. Anonymous sample ratings.
3. Anonymous sample favorites.
4. GentlePulse announcements.
5. Included in aggregate plugin seeding script.

---

## 9) Test and Coverage Signals

Evidence:
- `platform/test/api/gentlepulse.test.ts`
- `platform/test/e2e/gentlepulse.spec.ts`
- `platform/test/TEST_COVERAGE.md`

Signals:
1. Test files describe broader intended scope (favorites, progress, admin flows).
2. Several tests appear scaffold-like and use selectors/endpoints that do not match current implementation exactly.
3. Coverage summary marks GentlePulse as including progress + admin management, but server route implementation is narrower.

---

## 10) Gaps and Ambiguities to Resolve for ctf Rewrite

1. **Admin API mismatch**
   - UI calls:
     - `POST/PUT /api/gentlepulse/admin/meditations...`
     - `GET/POST/PUT/DELETE /api/gentlepulse/admin/announcements...`
   - Route file `gentlepulse.routes.ts` currently does not define these admin endpoints.

2. **Auth posture mismatch**
   - UI is behind `ProtectedRoute`.
   - Core GentlePulse APIs are public/anonymous with no `isAuthenticated` guard.
   - Decide target ctf model: authenticated-only, anonymous-only, or hybrid.

3. **Progress tracking mismatch**
   - Tests describe `POST/GET /api/gentlepulse/progress`.
   - No such endpoints in current GentlePulse routes.
   - Clarify whether “progress” is replaced by play count and/or mood integration.

4. **E2E selector drift**
   - E2E tests reference selectors and interactions not present in current UI (for example category filter and player selectors).
   - Align rewrite acceptance tests with actual designed UI contract.

5. **Mood integration boundary**
   - GentlePulse depends on Mood endpoints for check-in behavior.
   - Define whether ctf keeps this cross-plugin integration or encapsulates it within GentlePulse contracts.

---

## 11) Rewrite Guidance for ctf

Per `.claude/rules/index.mdc` contract, recommended rewrite baseline for feature parity:
1. Keep plugin name `GentlePulse`.
2. Preserve meditation library interactions:
   - sort/tag filtering,
   - favorites-only mode,
   - play count increment,
   - rating interactions.
3. Preserve accessibility settings capabilities and persisted preferences.
4. Preserve announcements surfaces (user + admin).
5. Decide and codify anonymous-vs-authenticated boundary explicitly.
6. Resolve missing admin/progress endpoint behavior via shared command contracts before implementation.
7. Maintain web/mobile parity using shared schema and policy controls.

---

## 12) Primary Evidence Index

### Server
- `platform/server/routes/gentlepulse.routes.ts`
- `platform/server/routes/mood.routes.ts`
- `platform/server/storage/plugins/gentlepulse-storage.ts`
- `platform/server/storage/types/gentlepulse-storage.interface.ts`

### Shared/Data
- `platform/shared/schema/gentlepulse/index.ts`
- `platform/schema.sql`

### Client
- `platform/client/src/pages/gentlepulse/library.tsx`
- `platform/client/src/pages/gentlepulse/settings.tsx`
- `platform/client/src/pages/gentlepulse/support.tsx`
- `platform/client/src/pages/gentlepulse/announcements.tsx`
- `platform/client/src/pages/gentlepulse/admin.tsx`
- `platform/client/src/pages/gentlepulse/admin-meditations.tsx`
- `platform/client/src/pages/gentlepulse/admin-announcements.tsx`
- `platform/client/src/components/gentlepulse/meditation-card.tsx`
- `platform/client/src/components/gentlepulse/desktop-nav.tsx`
- `platform/client/src/components/mood/mood-check-dialog.tsx`
- `platform/client/src/hooks/useClientId.ts`
- `platform/client/src/routes/plugin-routes.tsx`
- `platform/client/src/index.css`

### Scripts/Tests
- `platform/scripts/seedGentlePulse.ts`
- `platform/scripts/seedAllPlugins.ts`
- `platform/test/api/gentlepulse.test.ts`
- `platform/test/e2e/gentlepulse.spec.ts`
- `platform/test/TEST_COVERAGE.md`
