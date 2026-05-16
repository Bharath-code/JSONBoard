# JSONBoard Task Tracker

Single source of truth for execution. Update this file whenever work starts, finishes, changes priority, or gets blocked.

## Status Legend

- `[x]` Done and verified
- `[~]` In progress
- `[ ]` Not started
- `[!]` Blocked or needs decision

## Current Product Goal

Ship a production-ready JSONBoard MVP around one promise:

> Paste JSON. Get a useful, beautiful, shareable dashboard in seconds.

Launch quality depends on three gates first:

1. Best-in-class paste-to-dashboard experience
2. Excellent auto-chart engine
3. Beautiful, fast data table

## Current Implementation Snapshot

- `[x]` SvelteKit app scaffold created.
- `[x]` Bun package setup added.
- `[x]` Tailwind v4 styling foundation added.
- `[x]` shadcn-svelte-style local UI primitives added.
- `[x]` shadcn-svelte chart direction adopted with LayerChart dependency.
- `[x]` Typed JSONBoard engine created under `src/lib/jsonboard`.
- `[x]` Svelte 5 runes store created for dashboard state.
- `[x]` Main app route created at `/`.
- `[x]` JSON, single-object JSON, and JSONL parsing implemented.
- `[x]` Nested object flattening implemented.
- `[x]` Field inference implemented.
- `[x]` Stat cards implemented.
- `[x]` Chart recommendation engine implemented.
- `[x]` Data table search/sort/formatting implemented.
- `[x]` Sensitive-field detection and local redaction implemented.
- `[x]` `.json` / `.jsonl` local file upload implemented.
- `[x]` Unit tests added for core engine.
- `[x]` `bun run check` passes.
- `[x]` `bun run test` passes.
- `[x]` `bun run build` passes.

## Immediate Next Tasks

These are the next tasks before calling the app production-ready.

- `[~]` Browser QA pass for `/` on desktop and mobile.
  - Acceptance: no broken layout, no overlapping text, charts render visibly, examples switch correctly, table search/sort works.

- `[ ]` Replace remaining prototype-level chart UX with production chart interactions.
  - Acceptance: chart labels are readable, tooltips work, empty/weak chart states are clear, large datasets do not freeze.

- `[ ]` Add performance tests for the first three quality gates.
  - Acceptance: 2,000-row dashboard under 1.5s; 10,000-row table/chart behavior acceptable.

- `[ ]` Add golden datasets.
  - Acceptance: API logs, sales, users, benchmarks, nested JSON, hostile strings, mixed types, JSONL logs.

- `[ ]` Add chart correctness tests.
  - Acceptance: labels, totals, aggregation, type inference, ID/code exclusion, downsampling.

- `[ ]` Improve data table to true production quality.
  - Acceptance: virtualization beyond 500 rows, sticky first column, wide dataset ergonomics, mobile horizontal scan.

- `[ ]` Add share backend vertical slice.
  - Acceptance: `POST /api/share`, `/d/:slug`, TTL, owner key, expired state, safe serialization.

- `[ ]` Add public viewer route.
  - Acceptance: shared dashboard renders without signup and includes tasteful free branding.

- `[ ]` Add analytics events.
  - Acceptance: paste, generate, chart usefulness, table search/sort, redaction, share intent, share created, viewer-to-creator.

## Phase 1: Paste-To-Dashboard

- `[x]` Parse valid JSON arrays.
- `[x]` Auto-wrap single-object JSON.
- `[x]` Show inline invalid JSON error without deleting input.
- `[x]` Support JSONL input.
- `[x]` Support local `.json` / `.jsonl` upload.
- `[x]` Flatten nested objects to dot-notation fields.
- `[x]` Render stat cards, charts, and table after generation.
- `[x]` Show local-first privacy message before share/save.
- `[ ]` Verify empty arrays, nulls, Unicode, arrays, and mixed field types in browser.
- `[ ]` Verify 2,000-row render under 1.5s.
- `[ ]` Test five realistic datasets and record pass/fail.

## Phase 2: Auto-Chart Engine

- `[x]` Infer number, datetime, boolean, categorical, and string fields.
- `[x]` Avoid treating ID-like fields as measures.
- `[x]` Generate categorical + numeric bar charts.
- `[x]` Generate datetime + numeric line charts.
- `[x]` Generate numeric-pair scatter charts when useful.
- `[x]` Generate categorical/boolean breakdown charts.
- `[x]` Generate numeric histograms.
- `[x]` Generate readable chart titles.
- `[ ]` Add tooltips and stronger chart legends.
- `[ ]` Add explicit chart confidence fallback UI.
- `[ ]` Add downsampling tests for large datasets.
- `[ ]` Create golden expected chart outputs.
- `[ ]` Reach 80% useful chart rate across golden datasets.

## Phase 3: Data Table

- `[x]` Global search across visible columns.
- `[x]` Type-aware sorting.
- `[x]` Numeric right alignment and formatting.
- `[x]` Status-like badges.
- `[x]` Clean null/undefined rendering.
- `[x]` Dot-notation nested columns.
- `[x]` Horizontal scroll for wide datasets.
- `[~]` Cap visible rows to 500 for smoothness.
- `[ ]` Implement real virtualization beyond 500 rows.
- `[ ]` Add sticky first column polish.
- `[ ]` Verify mobile table usability.
- `[ ]` Add table-specific tests.

## Phase 4: Trust, Privacy, Redaction

- `[x]` Local-only behavior visible in app shell.
- `[x]` Sensitive field detection.
- `[x]` Local redaction for detected sensitive fields.
- `[~]` Share modal warns that backend share is next.
- `[ ]` Public share confirmation when sensitive fields remain.
- `[ ]` Redaction event tracking.
- `[ ]` Security tests for hostile strings and shared viewer escaping.

## Phase 5: Share Loop

- `[ ]` Create `POST /api/share`.
- `[ ]` Generate slug and owner key.
- `[ ]` Store shared dashboard with TTL.
- `[ ]` Create `/d/:slug` viewer route.
- `[ ]` Add expired dashboard state.
- `[ ]` Add delete-by-owner-key endpoint.
- `[ ]` Add branded free footer.
- `[ ]` Add viewer-to-creator CTA.
- `[ ]` Add share metrics.

## Phase 6: Monetization

- `[ ]` Add pricing page.
- `[ ]` Add Pro upgrade prompts at high-intent moments.
- `[ ]` Add password/private link paywall placeholder.
- `[ ]` Add longer retention paywall placeholder.
- `[ ]` Add no-branding paywall placeholder.
- `[ ]` Add custom slug paywall placeholder.
- `[ ]` Add checkout integration only after share loop validates demand.

## Phase 7: Workflow Adoption

- `[x]` JSONL input.
- `[x]` Local file upload.
- `[x]` API log example dataset.
- `[ ]` Add users example dataset.
- `[ ]` Add benchmark example dataset.
- `[ ]` Add templates/examples gallery.
- `[ ]` Track repeat creator rate.
- `[ ]` Decide CLI/Raycast/VS Code only after demand.

## Phase 8: Team/API Revenue

- `[ ]` Do not build until demand is validated.
- `[ ]` Define Team API ingestion contract.
- `[ ]` Define embed mode.
- `[ ]` Define workspace/multi-seat scope.
- `[ ]` Track API ingestion and embed demand signals.

## Open Product Decisions

- `[!]` Should the app use Cloudflare Worker routes immediately, or start with SvelteKit server routes and migrate share endpoints later?
- `[!]` Should shared viewer use the Svelte app route or a framework-independent Worker-rendered HTML viewer?
- `[!]` Which analytics provider should be used first: PostHog, Plausible, or custom event endpoint?
- `[!]` Should chart rendering stay with LayerChart despite bundle size, or lazy-load charts after dashboard generation?
- `[!]` What is the first pricing test: $9 Pro only, or Free/Pro/Team from day one?

## Quality Gates Before Launch

- `[ ]` 2,000-row paste-to-dashboard under 1.5s.
- `[ ]` 10,000-row table remains smooth.
- `[ ]` Chart render target under 500ms after downsampling.
- `[ ]` At least 4 of 5 realistic datasets produce share-worthy dashboards.
- `[ ]` At least 80% of generated charts are useful without manual config.
- `[ ]` No sensitive data can be shared without an explicit warning.
- `[ ]` Shared viewer safely escapes hostile JSON strings.
- `[ ]` Mobile layout has no overlapping text or unusable controls.

## Verification Commands

Run these before marking a task done:

```bash
bun run check
bun run test
bun run build
```

For frontend changes, also verify the app manually in browser:

```bash
bun run dev
```

Current local app URL:

```text
http://127.0.0.1:5174/
```

