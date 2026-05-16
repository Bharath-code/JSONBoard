# Plan: JSONBoard PRD + 10x Competitive Execution

> Source PRDs: `JSONBoard_PRD_v1.md`, `10x_competitive_strategy_plan.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Product promise**: Paste JSON. Get a useful, beautiful, shareable dashboard in seconds.
- **Primary routes**: `/` for paste/upload and local dashboard generation, `/d/:slug` for shared dashboards, `/pricing` for upgrade, `/dashboard` for paid dashboard history.
- **Core models**: `Dashboard`, `ParsedDataset`, `InferredField`, `ChartRecommendation`, `ShareLink`, `RedactionRule`, `DashboardOwner`.
- **Processing model**: Parse, infer, chart, and inspect locally first. Upload only when the user explicitly shares or saves.
- **Trust model**: Local-first until explicit share/save. Detect sensitive fields before public link creation.
- **Monetization model**: Free creates the viral loop. Pro monetizes privacy, persistence, and professional sharing. Team monetizes API ingestion, embeds, and live dashboards.
- **Measurement model**: Track activation, chart usefulness, table usage, share conversion, viewer-to-creator conversion, redaction usage, and paid intent from the beginning.
- **Quality gate**: The first three phases are mandatory before serious GTM. If paste-to-dashboard, chart quality, or table usability are weak, delay launch polish and paid features.

---

## Phase 1: Best-in-Class Paste-To-Dashboard Experience

**User stories**: PRD F-01, F-03, core interaction loop, first-use 10x wedge.

### What to build

Build the local-first dashboard generation flow. A user pastes JSON, validates it, gets inferred schema, flattened fields, stat cards, chart recommendations, and a table without signup or upload.

### Acceptance criteria

- [ ] Valid JSON array renders a dashboard within 1.5s for 2,000 rows.
- [ ] Single-object JSON is auto-wrapped into one row.
- [ ] Invalid JSON shows a useful inline error without deleting input.
- [ ] Empty arrays, nulls, Unicode, nested objects, arrays, and mixed field types do not crash.
- [ ] Nested objects appear as dot-notation fields where useful; deeper or array values are displayed safely.
- [ ] Dashboard has a polished first impression: stat cards, charts, and table feel intentionally arranged.
- [ ] User understands the value within 10 seconds without onboarding text.
- [ ] Local-only behavior is clear before any share/save action.

### Confidence gate

- [ ] Test with 5 realistic datasets: API logs, sales, users, benchmark results, nested API response.
- [ ] At least 4 of 5 datasets produce a dashboard a developer would plausibly share.

---

## Phase 2: Excellent Auto-Chart Engine

**User stories**: PRD F-02, chart selection logic, chart specs, 10x "it picked the right charts" moment.

### What to build

Build the chart engine as a product-quality system, not a demo heuristic. It should infer field types, score chart candidates, choose chart types, generate readable chart titles, aggregate data correctly, and downsample large datasets.

### Acceptance criteria

- [ ] Categorical + numeric fields produce useful bar or horizontal bar charts.
- [ ] Datetime + numeric fields produce time-series charts.
- [ ] Two meaningful numeric fields produce scatter plots when correlation or comparison is useful.
- [ ] Low-cardinality categorical fields produce breakdown charts.
- [ ] Single numeric fields produce histograms.
- [ ] Boolean fields produce true/false breakdowns.
- [ ] Numeric-looking IDs, ZIPs, phone numbers, and codes are not treated as measures.
- [ ] Chart render target is under 500ms for 10,000 rows after downsampling.
- [ ] Chart labels, totals, and aggregation match source data.
- [ ] Generated chart titles explain the insight, not just the field names.

### Confidence gate

- [ ] Maintain golden datasets with expected chart outputs.
- [ ] Chart quality review passes when at least 80% of generated charts are useful without manual configuration.
- [ ] Any dashboard with weak chart confidence still shows a strong table and stats instead of bad charts.

---

## Phase 3: Beautiful, Fast Data Table

**User stories**: PRD F-04, dashboard inspection workflow, developer confidence.

### What to build

Build the table as the fallback and trust layer. Even when charts are imperfect, the table must make the data easy to inspect, search, sort, and scan.

### Acceptance criteria

- [ ] Global search filters all visible columns in under 100ms for normal datasets.
- [ ] Column sorting toggles ascending/descending and is type-aware.
- [ ] Numeric values are right-aligned and locale-formatted.
- [ ] Status-like strings render as subtle readable badges.
- [ ] Null and undefined values render cleanly.
- [ ] Nested fields appear as dot-notation columns.
- [ ] Wide datasets support horizontal scanning without breaking layout.
- [ ] Tables virtualize beyond 500 rows.
- [ ] Mobile table remains usable with horizontal scroll and sticky first column if practical.

### Confidence gate

- [ ] Table remains smooth with 10,000 rows.
- [ ] Developer can answer "what is in this JSON?" even if no chart is useful.
- [ ] No text overflow or cramped layout in common desktop/mobile viewports.

---

## Phase 4: Trust, Privacy, and Redaction

**User stories**: PRD strategic review, 10x trust wedge, FAANG/workplace usability.

### What to build

Add the trust layer that makes JSONBoard usable for real work: visible local/share boundaries, sensitive field detection, redaction, and explicit public-link warnings.

### Acceptance criteria

- [ ] Users know whether data is local-only or uploaded.
- [ ] Sensitive fields are detected before share.
- [ ] Users can redact emails, tokens, API keys, phone numbers, IDs, and likely secrets.
- [ ] Public sharing requires confirmation when sensitive data is detected.
- [ ] Redacted dashboards preserve useful charts and table structure.
- [ ] Redaction and warning events are tracked.

---

## Phase 5: Share Loop and Public Viewer

**User stories**: PRD F-05, viral loop, self-contained viewer.

### What to build

Create the end-to-end share loop. A user generates a short dashboard URL, a recipient views it without signup, and the shared viewer creates a clear path for the recipient to create their own dashboard.

### Acceptance criteria

- [ ] Share creates `/d/:slug` with TTL and owner deletion key.
- [ ] Shared dashboard renders without signup.
- [ ] Free shared dashboards include tasteful JSONBoard branding.
- [ ] Viewer includes a clear "create your own dashboard" path.
- [ ] Expired dashboards show a useful expired state.
- [ ] Shared viewer safely serializes JSON and prevents script/HTML injection.
- [ ] Metrics track share rate, shared views, footer clicks, and viewer-to-creator conversion.

---

## Phase 6: Pro Monetization

**User stories**: PRD F-06, F-07, monetization strategy.

### What to build

Monetize privacy, persistence, and professional sharing through Pro features that appear at high-intent moments.

### Acceptance criteria

- [ ] Pro upgrade prompts appear at high-intent moments: password/private link, longer retention, custom slug, export, and no branding.
- [ ] Pro users can create password-protected/private links.
- [ ] Pro users get longer retention.
- [ ] Pro users can access dashboard history.
- [ ] Pro users can use custom slugs when available.
- [ ] Pro shared dashboards remove free branding.
- [ ] Checkout and paid feature usage are measured.

---

## Phase 7: Workflow Adoption

**User stories**: 10x strategy workflow phase, PRD future growth.

### What to build

Support real developer workflows beyond paste: JSONL, local file upload, examples/templates, and future workflow entry points such as CLI, Raycast, or VS Code.

### Acceptance criteria

- [ ] JSONL input works.
- [ ] `.json` and `.jsonl` file upload works locally.
- [ ] API/log payloads generate operational charts such as latency by endpoint, status breakdown, and errors over time.
- [ ] Examples/templates are available for common use cases.
- [ ] CLI/Raycast/VS Code integration is specified after usage validates demand.
- [ ] Repeat creator rate is tracked over 7 and 30 days.

---

## Phase 8: Team/API Revenue

**User stories**: PRD F-08, F-09, Team tier.

### What to build

Build Team only after demand is validated. Add API ingestion, live updating dashboards, embeds, team workspace basics, and higher limits for serious recurring workflows.

### Acceptance criteria

- [ ] Team users can POST JSON to an ingestion endpoint.
- [ ] API ingestion updates an existing dashboard URL.
- [ ] Team dashboards support higher limits and long/permanent retention.
- [ ] Embed mode hides creator controls and presents a clean viewer.
- [ ] Team workspace supports basic multi-seat management.
- [ ] Metrics track API ingestion, active Team dashboards, embed loads, and Team retention.

---

## Test plan

- [ ] Golden datasets cover API logs, sales, users, benchmarks, nested JSON, hostile strings, mixed types, and JSONL logs.
- [ ] Performance tests verify 2,000-row dashboard generation under 1.5s and acceptable 10,000-row chart/table behavior.
- [ ] Chart correctness tests verify labels, totals, aggregation, type inference, and downsampling.
- [ ] Table tests verify search, sort, formatting, virtualization, mobile layouts, and wide datasets.
- [ ] Security tests verify shared viewer escaping, sensitive field detection, and redaction.
- [ ] Funnel tests verify paste-to-dashboard, dashboard-to-share, viewer-to-creator, and Pro upgrade intent.

## Assumptions

- `JSONBoard_PRD_v1.md` is a primary source, not just background context.
- `10x_competitive_strategy_plan.md` defines the competitive wedge and priority order.
- Free product quality comes before Pro/Team breadth.
- Local-first behavior is the default until explicit share/save.
- The product wins only if auto-chart quality and table usability are genuinely strong.
