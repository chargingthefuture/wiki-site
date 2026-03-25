# Survivor Hub Chat Rewrite Checklist

## Scope

- Rewrite target: `ctf/packages/web`
- Surface: `community-shell` app shell home page
- Reference: `ctf/docs/developer/ctf-plugin-feature-inventories/ctf-survivor-hub-chat-feature-inventory.md`

---

## Phase 0 — Static/Demo UI

### Implementation Requirements

- [x] Discord-style 4-column layout: icon rail (72px), left sidebar (240px), main content (flex), right rail (280px).
- [x] Section toggle (Chat / Apps) controlled by icon rail buttons.
- [x] Chat tab: pre-seeded static messages with hub avatar and user avatar.
- [x] Chat tab: input field + send button wired to local state only (no backend).
- [x] Chat tab: suggestion chips that pre-fill the input.
- [x] Chat tab: action buttons in hub messages link to correct plugin routes.
- [x] Chat tab: hero banner with live stats (member count, GDP) from GDP plugin data.
- [x] Apps tab: 3-column plugin grid driven by live plugin registry, with per-plugin color theming.
- [x] Sidebar: static channel list (chat mode) linking to plugin routes as placeholders.
- [x] Sidebar: static DM list (placeholder names, no routing).
- [x] Sidebar: app list (apps mode) with per-plugin color accent and active state.
- [x] Right rail: Clerk user first name / username displayed (no hardcoded names).
- [x] Right rail: GDP progress bar with live values from GDP repository (zero if no data).
- [x] Right rail: active plugin list (top implemented plugins).
- [x] Modularity: components split per rule 116 (max 200 lines per primary function/file).
- [x] No hardcoded stat values — all stats sourced from live data or show zero/absent.
- [x] Footer note: "Human-assisted · GetStream powered (coming soon)."

### Pre-Release Gates

- [ ] Visual QA against Desktop mockup (`mockups/mockups-master/artifacts/mockup-sandbox/src/components/mockups/survivor-hub/Desktop.tsx`).
- [ ] Mobile responsive layout checked at 900px and 1200px breakpoints.
- [ ] GDP stats display "0" or absent (not hardcoded) when no published GDP data exists.
- [ ] Right rail shows Clerk first name or username, not placeholder "Survivor" hardcoded text when user is signed in.
- [ ] Clerk `UserButton` renders in icon rail for signed-in users.
- [ ] No TypeScript errors in `community-shell` component tree.
- [ ] ESLint passes with zero warnings (`pnpm lint`).
- [ ] Plugin card "Open plugin →" links navigate to correct `/apps/[slug]` route.
- [ ] Channel links navigate to correct plugin routes.

### Known Deferrals

- [ ] DEFERRED (Phase 1): GetStream channel wiring for real-time chat.
- [ ] DEFERRED (Phase 1): Operator dashboard for human-in-the-loop responses.
- [ ] DEFERRED (Phase 1): Postgres transcript logging.
- [ ] DEFERRED (Phase 1): Unread message counts on channel list.
- [ ] DEFERRED (Phase 1): Live DM routing.
- [ ] DEFERRED (Phase 2): Intent classifier and slot-filler automation.
- [ ] DEFERRED (Phase 3): LLM-augmented RAG routing.

---

## Phase 1 — Human-in-the-Loop (Planned)

> Not yet designed. Specs required before any implementation begins.

### Pre-Implementation Requirements

- [ ] GetStream channel provisioning spec written and approved.
- [ ] Postgres `chat_transcripts` schema designed and migration written.
- [ ] Postgres `intent_labels` schema designed and migration written.
- [ ] Operator dashboard spec and wireframe approved.
- [ ] Auth/policy contracts written: Clerk authz requirements for operator role.
- [ ] Privacy review: confirm retention policy for transcript data.
- [ ] Rollout plan: how to migrate static Phase 0 UI to live channel without disrupting existing users.

### Implementation Requirements (pending spec)

- [ ] GetStream channel provisioned per authenticated user.
- [ ] Operator GetStream dashboard for viewing/responding to queued chats.
- [ ] Chat input wired to GetStream channel (replace local state).
- [ ] Transcript storage in Postgres with required fields.
- [ ] Background ETL job for intent label extraction.
- [ ] Operator typing indicator displayed in chat panel.
- [ ] Human fallback queue monitoring with alerts.

---

## Phase 2 — Hybrid Automation (Planned)

> Not yet designed. Requires Phase 1 completion and labeled dataset.

### Pre-Implementation Requirements

- [ ] Minimum labeled example volume reached (≥ threshold TBD by ML owner).
- [ ] Intent classifier trained and evaluated offline.
- [ ] Canonical intent→plugin→action matrix documented and approved.
- [ ] Routing service API spec written.
- [ ] Confidence threshold policy approved for auto-respond vs. human fallback.
- [ ] SLA policy for human fallback queue.

---

## Phase 3 — LLM-Augmented Routing (Planned)

> Not yet designed. Requires Phase 2 completion and cost/privacy evaluation.

### Pre-Implementation Requirements

- [ ] LLM provider selected and evaluated (latency, cost/turn, safety features, data agreements).
- [ ] Privacy audit: confirm no PII/PHI leaves in-house boundary.
- [ ] Prompt template library designed and approved.
- [ ] Retrieval layer (vector store) designed: content indexed, update cadence defined.
- [ ] RAG pipeline spec written and approved.

---

## Change Log

- 2026-03-23: Initial checklist created. Phase 0 implementation completed. Phases 1–3 deferred pending spec.
