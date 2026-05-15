

**JSONBoard**

*Paste JSON. Get a dashboard. Share in one click.*

Product Requirements Document  •  v1.0

May 2026

Confidential  •  Solo Founder: Bharath

# **1\. Executive Summary**

JSONBoard is a zero-setup, browser-based JSON visualisation tool that converts any JSON payload into an interactive dashboard — complete with auto-generated charts, a filterable data table, and a shareable URL — in under three seconds.

Developers spend an outsized amount of time staring at raw JSON in terminals, editors, and browser network tabs. When they want to make sense of that data — or share it with a teammate or stakeholder — their only options are heavyweight BI tools (Metabase, Grafana, Superset) that require database connections and dedicated infrastructure, or spreadsheets that require manual reformatting. JSONBoard collapses this to a single paste.

| The one-line pitch |
| :---- |
| Metabase for people who just have JSON and 30 seconds. |

## **Key metrics targets**

| Metric | Month 3 | Month 12 |
| :---- | :---- | :---- |
| Unique dashboards created/week | 500+ | 5,000+ |
| Paying users (Pro \+ Team) | 25 | 300 |
| MRR | ₹18,000 | ₹2,20,000 |
| ARR | — | ₹26,40,000 |
| Viral coefficient (k-factor) | \> 0.3 | \> 0.6 |

# **2\. Problem Statement**

## **2.1  The pain in plain sight**

Every developer has lived this moment: an API returns 3,000 rows of JSON, a log pipeline emits analytics payloads every minute, a CI job produces a benchmark result object. The developer wants to answer a simple question — which endpoint is slowest? which user segment churned? what did revenue look like last month? — but the only tools available are:

* cat response.json | python \-m json.tool | grep ... — works, but produces no insight

* Copy into a spreadsheet — requires manual column mapping, kills structure

* Spin up Metabase — 20-minute Docker setup, needs a running database

* Use Grafana — requires a datasource plugin, time-series assumption baked in

* Hire a data analyst — not an option for a solo founder or small team

None of these options give a developer what they actually want: a visual answer right now, from the JSON they already have, with a link they can share in Slack.

## **2.2  Why existing tools miss**

| Tool | Why it fails for this use case |
| :---- | :---- |
| Metabase | Requires a persistent database, Docker, a server. Overkill for ad-hoc JSON. |
| Grafana | Built for time-series metrics. Requires a datasource. No JSON paste. |
| Superset | Apache project, complex setup, requires SQL knowledge. |
| Observable / Vega | Requires writing code. Not paste-and-go. |
| Google Sheets | Requires reformatting JSON into rows/columns manually. |
| ChatGPT data analysis | No shareable URL. Ephemeral. Requires file upload, not paste. |
| Quickchart.io | You must specify the chart type and write config. No auto-detection. |

## **2.3  The precise gap**

There is no tool that takes raw JSON as input and produces a shareable, interactive dashboard as output, with zero configuration and zero signup required. JSONBoard fills exactly this gap.

## **2.4  Who feels this pain most acutely**

* Solo developers and indie hackers inspecting API responses or analytics payloads

* Backend engineers sharing debug data with frontend teammates

* Startup founders doing quick data analysis without a data team

* Developer advocates and technical writers explaining API responses in docs

* Freelance developers showing clients what their data looks like

# **3\. Product Solution**

## **3.1  Core interaction loop**

1. User pastes a JSON array into the input box (or clicks an example)

2. JSONBoard auto-detects field types: numeric, categorical, boolean, datetime

3. A dashboard renders: stat cards, 2–4 relevant charts, a filterable table

4. User clicks 'Share' — a short URL (jsonboard.dev/d/abc123) is generated

5. Anyone with the link sees the dashboard — no signup, no install

## **3.2  What makes this a product and not a script**

* Auto-chart selection: the system chooses chart types based on field types, not user config

* Shareable links: KV-backed persistent URLs with configurable TTL

* Self-contained viewer: shared links render without any frontend framework dependency

* Viral loop: every shared link carries a branded footer that drives new signups

* Progressive upgrade: free users hit limits (size, TTL, privacy) that have a clear Pro path

## **3.3  Auto-chart selection logic**

This is the core intellectual property of JSONBoard. The chart selection engine runs on the client, costs nothing, and makes the product feel magical.

| Field combination detected | Chart type rendered | Example |
| :---- | :---- | :---- |
| 1 categorical \+ 1 numeric | Vertical bar chart | month vs revenue |
| 1 categorical \+ 1 numeric (trend) | Line chart | date vs requests |
| 1 categorical with ≤ 8 unique values | Doughnut / pie | status breakdown |
| 2 numeric fields | Scatter plot | latency vs error\_rate |
| 1 numeric only | Histogram / distribution | response\_times |
| Boolean field | True/False ratio bar | is\_active counts |
| Datetime \+ numeric | Time-series line | created\_at vs amount |

The engine scores every pair of fields and picks the top 4 combinations. Charts are ranked by information density — a scatter plot of two numerics beats a bar chart of the same two if the relationship is non-linear.

# **4\. Technical Architecture**

## **4.1  Architecture philosophy**

JSONBoard is built on three principles: (1) zero cold starts — every request is served by Cloudflare's edge, globally; (2) zero database — the only persistence layer is Cloudflare KV, a key-value store designed for exactly this read-heavy, share-once pattern; (3) zero frontend framework for the viewer — shared dashboard links are self-contained HTML files served directly from the Worker, with Chart.js inlined. This means a shared link will render even if jsonboard.dev goes down.

## **4.2  Tech stack**

| Layer | Technology & rationale |
| :---- | :---- |
| Frontend app | SvelteKit — SSR for fast initial load, smaller bundles (~30 KB vs ~120 KB for Next.js), no virtual DOM overhead for chart rendering, simpler state management via stores. Deployed to Vercel. |
| Styling | Tailwind CSS — utility classes, no runtime CSS-in-JS overhead |
| Charts (app) | Chart.js 4 — lightweight, canvas-based, no D3 complexity. Animations use Chart.js native + CSS transitions only. No animation library. |
| Worker runtime | Cloudflare Workers \+ Hono — sub-1ms cold start, TypeScript-native, free tier generous |
| Persistence | Cloudflare KV — key-value store, global replication, 25 MB value limit, TTL built-in. No database at MVP. |
| Large payloads | Cloudflare R2 — S3-compatible object store, $0.015/GB/month, replaces KV for \>1 MB blobs |
| Slug generation | nanoid — 8-char URL-safe IDs, \~1 billion possible slugs before collision risk |
| Auth (Pro/Team) | Stripe Checkout + signed JWT cookie — no login system, no password, no OAuth at MVP. Cookie contains {plan, exp} signed with shared secret, verified by SvelteKit server and Worker. Recovery via Stripe Customer Portal. |
| Password hashing | PBKDF2 via Web Crypto API (crypto.subtle.deriveBits) — \~10ms verification in Workers. bcrypt is too slow (\~500ms). |
| Payments | Stripe — subscriptions, webhook for tier upgrade/downgrade |
| Deployment | Vercel (SvelteKit) \+ Wrangler (Workers) — independent deploy pipelines |
| Package manager | Bun — 10x faster installs, native TypeScript runner for scripts |
| Type safety | TypeScript end-to-end — shared types between Worker and SvelteKit app |

## **4.3  Cloudflare Worker routes**

| Route | Logic |
| :---- | :---- |
| POST /api/share | Validate JSON (parse, size check). Generate nanoid slug. Write to KV with TTL. Return { slug, url, owner\_key }. |
| GET /d/:slug | KV.get(slug). If R2 key present, fetch from R2. Return self-contained HTML with JSON embedded in \<script\> tag. |
| DELETE /api/share/:slug | Verify owner\_key header matches stored value. KV.delete(slug). Return 204\. |
| GET /api/meta/:slug | Return metadata only (row\_count, created\_at, ttl\_days, is\_password\_protected) — used by the Pro dashboard history UI. |
| POST /api/share/:slug/password | Pro only. Store bcrypt hash of password in KV metadata. Viewer prompts for password before rendering. |

## **4.4  KV key schema**

| KV key: d:{slug} |
| :---- |
| json\_raw: string          — the full JSON payload (or r2\_key if large) |
| created\_at: ISO 8601      — creation timestamp |
| ttl\_days: number          — 7 (free) | 90 (Pro) | permanent (Team) |
| owner\_key: string         — random 32-char token returned at creation for delete auth |
| row\_count: number         — cached count for fast meta endpoint |
| plan: 'free'|'pro'|'team' — determines viewer branding and features |
| pw\_hash?: string          — bcrypt hash, present only if password-protected |
| r2\_key?: string           — present if payload \> 1 MB, points to R2 object |

## **4.5  Size routing logic**

* ≤ 1 MB (free): store JSON directly in KV value

* ≤ 10 MB (Pro): store in R2, store r2\_key in KV

* \> 10 MB (Team): store in R2 with multipart, store r2\_key in KV

* \> 50 MB: reject at Worker level with 413 and helpful error message

## **4.6  Folder structure**

| Repository layout |
| :---- |
| jsonboard/ |
| ├── apps/ |
| │   ├── web/                    ← SvelteKit frontend (paste UI, Pro dashboard, auth) |
| │   │   ├── src/ |
| │   │   │   ├── routes/ |
| │   │   │   │   ├── +page.svelte  ← paste + dashboard renderer |
| │   │   │   │   ├── d/[slug]/     ← redirect to Worker viewer |
| │   │   │   │   ├── dashboard/    ← Pro: history, settings |
| │   │   │   │   └── api/          ← SvelteKit API routes (auth, Stripe webhooks) |
| │   │   │   └── lib/ |
| │   │   │       ├── components/ |
| │   │   │       │   ├── JsonInput.svelte |
| │   │   │       │   ├── Dashboard.svelte |
| │   │   │       │   ├── ChartEngine.svelte  ← auto-chart selection logic |
| │   │   │       │   ├── StatCards.svelte |
| │   │   │       │   ├── DataTable.svelte |
| │   │   │       │   └── ShareButton.svelte |
| │   │   │       └── chartSelector.ts ← field-type detection + chart ranking |
| │   │   └── app.html |
| │   └── worker/                 ← Cloudflare Worker (Hono app) |
| │       ├── src/ |
| │       │   ├── index.ts         ← Hono app, all routes |
| │       │   ├── kv.ts            ← KV read/write helpers |
| │       │   ├── r2.ts            ← R2 read/write helpers |
| │       │   ├── viewer.ts        ← self-contained HTML generator |
| │       │   └── slug.ts          ← nanoid wrapper |
| │       └── wrangler.toml |
| ├── packages/ |
| │   └── shared/                 ← shared TypeScript types |
| │       └── types.ts |
| ├── package.json                ← Bun workspaces |
| └── bun.lockb |

# **5\. Feature Specifications & Acceptance Criteria**

## **5.1  F-01: JSON input and validation**

| Field | Detail |
| :---- | :---- |
| Description | User pastes raw JSON into a textarea. The app validates it, shows errors, and parses field types on success. |
| Acceptance criteria | AC1: Valid JSON array renders dashboard within 1.5s on a 2,000-row payload. AC2: Invalid JSON shows inline error with line number. AC3: Non-array JSON (single object) is auto-wrapped in array. AC4: Empty array shows 'no data' state. AC5: Unicode and nested objects are handled without crash. |
| Edge cases | JSON with mixed types per field (some rows string, some numeric) — treat as string. Nested objects — flatten one level and stringify deeper. Null values — display as '—' in table, skip in chart calculations. |
| Error states | 413 (too large for plan), invalid JSON (syntax error with position), empty input (prompt to paste). |

## **5.2  F-02: Auto-chart generation**

| Field | Detail |
| :---- | :---- |
| Description | The chart selection engine analyses field types and renders up to 4 charts without any user configuration. |
| Acceptance criteria | AC1: A payload with 1 categorical \+ 1 numeric field always renders a bar chart. AC2: A payload with a field containing 'date', 'time', or '\_at' in the name and a numeric field renders a time-series line chart. AC3: A payload with 2+ numeric fields renders a scatter plot. AC4: A payload with a categorical field of ≤ 8 unique values renders a doughnut. AC5: Charts render correct data — totals and labels match raw JSON values. |
| Chart library | Chart.js 4 (canvas-based). No D3, no Recharts in the shared viewer (to keep viewer HTML self-contained). |
| Performance | Chart render \< 500ms for payloads up to 10,000 rows. Downsample to 1,000 points for scatter/line when row count \> 10,000. |

## **5.3  F-03: Stat cards**

| Field | Detail |
| :---- | :---- |
| Description | Above the charts, display 4–6 stat cards computed from the data: row count, field count, sum/avg for top numeric fields. |
| Acceptance criteria | AC1: Always shows 'Records: N' and 'Fields: N'. AC2: For each numeric field (up to 3), shows 'Total {field}: {sum}'. AC3: Numbers ≥ 10,000 are formatted with 'k' suffix. AC4: Cards are responsive — 2 columns on mobile, 4 on desktop. |

## **5.4  F-04: Filterable data table**

| Field | Detail |
| :---- | :---- |
| Description | A full data table below the charts with search, column sort, and type-aware rendering (badges for status values, number formatting for numerics). |
| Acceptance criteria | AC1: Text search filters all columns simultaneously with \< 100ms latency. AC2: Clicking a column header sorts ascending; clicking again sorts descending. AC3: String values matching known status words (active, paused, error, success, trial, churned) render as colour-coded badges. AC4: Numeric columns right-align and use locale number formatting. AC5: Table virtualises rows beyond 500 — no DOM nodes for off-screen rows. |

## **5.5  F-05: Shareable link generation**

| Field | Detail |
| :---- | :---- |
| Description | User clicks 'Share' and receives a short URL (jsonboard.dev/d/{slug}) that renders the same dashboard for anyone with the link. |
| Acceptance criteria | AC1: Share button calls POST /api/share and returns a URL within 800ms on a standard connection. AC2: The shared URL renders the full dashboard without requiring the viewer to be logged in. AC3: The shared URL includes a copy button that copies the URL to clipboard. AC4: Free tier shared links expire after 7 days — expired links show a clear 'this dashboard has expired' page with an upgrade CTA. AC5: The owner receives an owner\_key in local storage enabling future deletion. |
| Viral mechanism | Free-tier shared dashboards include a 'Made with JSONBoard' footer link pointing to jsonboard.dev with utm\_source=share. |

## **5.6  F-06: Pro — password protection**

| Field | Detail |
| :---- | :---- |
| Description | Pro users can set a password on a shared dashboard. Viewers must enter the password before the JSON is sent to the client. |
| Acceptance criteria | AC1: Password is set via a modal after share link is generated. AC2: The password is never stored in plain text — bcrypt hash stored in KV. AC3: Viewer sees a password prompt page before dashboard HTML is returned by the Worker. AC4: 5 failed attempts locks the viewer for 10 minutes (rate-limited at Worker level via KV counter). |

## **5.7  F-07: Pro — dashboard history**

| Field | Detail |
| :---- | :---- |
| Description | Pro users see a history of all dashboards they have created, with metadata and management actions. |
| Acceptance criteria | AC1: History shows dashboard name (auto-generated from top fields), created date, row count, TTL remaining, and share URL. AC2: Users can delete a dashboard from history (calls DELETE /api/share/:slug). AC3: Users can extend TTL of an existing dashboard (re-PUT to KV with new TTL). AC4: History is paginated at 20 items per page. |

## **5.8  F-08: Team — API ingestion endpoint**

| Field | Detail |
| :---- | :---- |
| Description | Team users get a permanent API endpoint (POST /api/ingest/{workspace}/{channel}) that accepts JSON payloads programmatically and updates a live dashboard URL. |
| Acceptance criteria | AC1: API accepts Bearer token auth. AC2: Each POST updates the existing dashboard in-place — the share URL stays the same. AC3: Supports webhook mode: POSTing a payload triggers a webhook to a user-configured URL. AC4: Ingest rate limit: 100 requests/minute per workspace. AC5: Dashboard updates are reflected in the viewer within 5 seconds. |

## **5.9  F-09: Team — embed iframe**

| Field | Detail |
| :---- | :---- |
| Description | Team users can embed a dashboard as an iframe in any webpage using a generated embed snippet. |
| Acceptance criteria | AC1: Embed snippet is a single \<iframe\> tag with a ?embed=true query param. AC2: Embedded view hides the JSONBoard header and share button. AC3: Embedded view still shows 'Powered by JSONBoard' badge (cannot be removed on Team; removable on custom enterprise plan). |

# **6\. UI Screens & User Flows**

## **6.1  Screen 1: Landing / Paste**

URL: jsonboard.dev/

* Hero: logo, tagline ('Paste JSON. Get a dashboard. Share in one click.')

* Large textarea (70vh on desktop, 50vh on mobile) with monospace font

* Placeholder text: example JSON array with 3 rows

* 'Try an example' buttons: Sales, API logs, Users — load demo datasets

* 'Generate dashboard' primary CTA button (disabled until valid JSON detected)

* Below fold: 'How it works' — 3-step visual, no signup required messaging

* Above-fold social proof: 'X dashboards created today' (live counter from KV meta key)

## **6.2  Screen 2: Dashboard view (same page, replaces input)**

* Stat cards row — 4–6 cards, responsive grid

* Charts area — 2-column grid on desktop, 1-column on mobile, up to 4 charts

* 'Share' button top-right — opens share modal on click

* '← New dashboard' text link — returns to paste input

* Data table — full width, below charts, with search input and column headers

* Upgrade nudge banner (free users only): 'Pro keeps your link for 90 days — $9/month'

## **6.3  Screen 3: Share modal**

* Copy-able URL in a pill input with 'Copy' button

* 'Link expires in 7 days' notice (free) or '90 days' (Pro)

* Password toggle (Pro only — greyed out with 'Pro feature' lock on free)

* 'Open in new tab' link

* 'Delete this dashboard' link (uses owner\_key from localStorage)

## **6.4  Screen 4: Shared dashboard viewer**

* Served as self-contained HTML from the Worker (no Next.js dependency)

* Same stat cards \+ charts \+ table layout as Screen 2

* 'Made with JSONBoard — try it free' footer (free plan) or no footer (Pro/Team)

* Password prompt overlay (if password-protected) — single text input, submit button

* Expired link page: '404 — this dashboard has expired' with upgrade CTA

## **6.5  Screen 5: Pro / Team upgrade page**

* Three-column pricing table: Free | Pro ($9/mo) | Team ($29/mo)

* Feature checklist per column (matching the monetization spec)

* Stripe Checkout integration — no custom payment form

* Post-purchase: redirect to dashboard history page

## **6.6  Screen 6: Pro dashboard history**

* Table: dashboard name | created | rows | TTL remaining | actions

* Actions: Copy URL, Extend TTL, Delete

* Top right: 'Create new' button (returns to paste UI)

* Account settings: manage subscription (Stripe customer portal link)

## **6.7  Mobile considerations**

* Paste input: full-width, min 200px tall, pinch-to-zoom disabled on textarea

* Charts: single column, 1.6:1 aspect ratio, horizontal scroll for table

* Share modal: bottom sheet on mobile, centred modal on desktop

* Table: first column sticky, horizontal scroll for overflow columns

# **7\. Chart Specifications**

## **7.1  Chart library decision**

Chart.js 4 (UMD build from cdnjs). Rationale: (1) canvas-based — renders correctly in self-contained HTML viewer without React; (2) 60 KB gzipped vs D3's 280 KB; (3) sufficient for all chart types JSONBoard needs; (4) no build step required for the viewer HTML.

## **7.2  Chart type specifications**

| Chart type | When rendered | Key config |
| :---- | :---- | :---- |
| Vertical bar | 1 categorical \+ 1 numeric field | borderRadius: 4, no legend, x-axis labels rotate if \> 8 items |
| Line chart | Categorical/date \+ numeric, or detected time trend | tension: 0.4, fill: true with 15% opacity, pointRadius: 3 |
| Doughnut | Categorical field with 2–8 unique values | Legend right, cutout: '65%', hover offset: 8 |
| Scatter plot | 2 numeric fields | pointRadius: 5, no connecting line, axis labels from field names |
| Histogram | Single numeric field only | 10 equal-width bins, computed client-side before Chart.js |
| Horizontal bar | Categorical \+ numeric with \> 12 label chars average | Better readability for long labels |
| True/false bar | Boolean field detected | Two-segment bar: true count vs false count, green/red |

## **7.3  Colour palette**

* Primary series: \#378ADD (blue), \#1D9E75 (teal), \#D85A30 (coral), \#D4537E (pink)

* Extended: \#BA7517 (amber), \#7F77DD (purple), \#639922 (green), \#E24B4A (red)

* All charts use same palette in order — consistency across dashboard

* Dark mode: same hues, 15% lighter. Auto-detected via matchMedia.

## **7.4  Responsive chart sizing**

* Desktop: charts in 2-column grid, aspectRatio: 1.8

* Mobile: charts in 1-column, aspectRatio: 1.4 (taller for readability)

* Max 4 charts per dashboard — ranked by information density score

* Each chart has a generated title: '{labelField} by {valueField}'

# **8\. Monetization Strategy**

## **8.1  Tier structure**

| Feature | Free | Pro ($9/mo) | Team ($29/mo) |
| :---- | :---- | :---- | :---- |
| JSON size limit | 1 MB | 10 MB | 50 MB |
| Link TTL | 7 days | 90 days | Permanent |
| Password protection | No | Yes | Yes |
| Dashboard history | No | Yes (unlimited) | Yes (unlimited) |
| Custom slug | No | Yes | Yes |
| CSV export | No | Yes | Yes |
| Branding on shared view | JSONBoard footer | No footer | No footer |
| API ingestion endpoint | No | No | Yes |
| Embed iframe | No | No | Yes |
| Team seats | 1 | 1 | 5 |
| Webhook on update | No | No | Yes |
| Custom domain | No | No | Yes |
| Support | Community | Email | Priority email |

## **8.2  Upgrade triggers — psychology of conversion**

The three moments that convert free users to paid are designed into the product, not bolted on after.

* Link expiry email: 2 days before expiry, free users receive 'Your dashboard expires in 2 days — Pro keeps it for 90.' This is the highest-converting trigger.

* Size rejection: when a user tries to share a JSON file over 1 MB, they see 'This payload is 2.3 MB. Pro supports up to 10 MB.' with an inline upgrade CTA.

* Branded footer virality: every free shared dashboard carries 'Made with JSONBoard'. Viewers who click get the paste UI. Viewers who sign up and share become free users who hit the same triggers.

* Password request: when a free user tries to enable password protection on the share modal, they see the Pro upgrade modal. This converts well because the intent (privacy) is high-signal.

## **8.3  Pricing rationale**

* $9/month Pro: below the psychological $10 threshold. Targets individual developers. Equivalent to one month of a mediocre SaaS tool they already pay for.

* $29/month Team: 3x Pro, justified by API ingestion \+ embed — features with direct business value, not convenience. Targets small startups with a non-technical stakeholder who needs to see the data.

* Annual discount: 2 months free (Pro: $90/yr, Team: $290/yr). Shown on pricing page, not in upgrade CTAs.

## **8.4  Sequencing — what to build and when**

6. Week 1–3: Ship free tier. Paste \+ dashboard \+ shareable link. Branded footer. Focus: get the share URL in circulation.

7. Week 4: Add Stripe. Launch Pro at $9. The expiry email alone is enough to convert. Don't wait for 100 users.

8. Week 8: Add password protection and dashboard history for Pro users.

9. Week 12+: Build Team tier only after 3+ Pro users mention teammates or API use cases.

10. Month 6+: Add custom domain support and embed for Team. These are sales features, not growth features.

# **9\. Financial Model**

## **9.1  Cost of running the business**

JSONBoard's infrastructure cost at launch is effectively zero. The Cloudflare free tier is generous enough to support the first several months of growth.

| Cost item | Monthly cost |
| :---- | :---- |
| Cloudflare Workers (free tier: 100k req/day) | ₹0 (free) |
| Cloudflare KV (free tier: 100k reads/day, 1k writes/day) | ₹0 (free) |
| Cloudflare R2 (free tier: 10 GB storage, 1M class A ops) | ₹0 (free) |
| Vercel (free tier: 100 GB bandwidth, hobby plan) | ₹0 (free) |
| Stripe (2.9% \+ 30¢ per transaction, no monthly fee) | Variable — 0 at zero revenue |
| Domain (jsonboard.dev) | ₹1,200 / year ≈ ₹100/month |
| Clerk auth (free tier: 10k MAU) | ₹0 (free) |
| Resend email (free tier: 100 emails/day) | ₹0 (free) |
| TOTAL at launch | ≈ ₹100/month (domain only) |

## **9.2  Cost at scale (Month 12\)**

| Cost item | Monthly cost estimate |
| :---- | :---- |
| Cloudflare Workers paid ($5/10M requests) | ₹420 (\~50M req/month at scale) |
| Cloudflare KV paid ($0.50/million reads beyond free) | ₹840 (\~2M reads/month) |
| Cloudflare R2 paid ($0.015/GB beyond 10 GB) | ₹630 (\~50 GB stored) |
| Vercel Pro ($20/month) | ₹1,680 |
| Stripe fees (on ₹2,20,000 MRR) | ₹6,500 (\~3%) |
| Resend paid ($20/month for 50k emails) | ₹1,680 |
| Clerk paid ($25/month for \>10k MAU) | ₹2,100 |
| TOTAL at Month 12 (300 paying users) | ≈ ₹13,850 / month |

## **9.3  Revenue model**

| Scenario | Calculation |
| :---- | :---- |
| Month 3 — 25 paying users | 20 Pro × $9 \+ 5 Team × $29 \= $325/mo ≈ ₹27,000 MRR |
| Month 6 — 80 paying users | 60 Pro × $9 \+ 20 Team × $29 \= $1,120/mo ≈ ₹93,500 MRR |
| Month 12 — 300 paying users | 220 Pro × $9 \+ 80 Team × $29 \= $4,300/mo ≈ ₹3,58,000 MRR |
| Month 12 ARR | ₹3,58,000 × 12 \= ₹43,00,000 ARR |
| Month 12 net margin | Revenue ₹3,58,000 − Costs ₹13,850 \= ₹3,44,150 (96% margin) |

## **9.4  Path to ₹1 crore ARR**

| Milestone | What needs to happen |
| :---- | :---- |
| ₹1 crore ARR \= \~₹83,000 MRR | 230 Pro users \+ 50 Team users (or equivalent mix) |
| Free-to-paid conversion rate needed | 2% of active free users. Industry average is 2–5% for dev tools. |
| Free users needed at conversion | 14,000 active free users (dashboards created in last 30 days) |
| Dashboards/week needed | \~700/week at 20 active weekly creators per 1,000 registered |
| K-factor needed to get there | \>0.4 (each shared link generates 0.4 new creators on average) |

## **9.5  Cloudflare free tier limits and when you hit them**

| Limit | When you hit it |
| :---- | :---- |
| Workers: 100k requests/day | At \~3,000 dashboard creates/day \+ share views. Month 4–5 at growth. |
| KV: 1k writes/day | At 1,000 new dashboards/day. Month 3–4. Upgrade to $5/mo paid KV. |
| KV: 100k reads/day | At 100k dashboard views/day. Month 6–7. |
| R2: 10 GB storage | At \~10,000 Pro dashboards averaging 1 MB each. Month 6\. |
| Vercel: 100 GB bandwidth | At \~50,000 visits/day with average 2 MB page load. Month 5–6. |

## **9.6  Unit economics**

* Customer Acquisition Cost (CAC): ₹0 at launch — 100% organic via viral share links

* Lifetime Value (LTV) Pro: $9/mo × 18 months avg \= $162 ≈ ₹13,500

* LTV Team: $29/mo × 24 months avg \= $696 ≈ ₹58,000

* LTV:CAC ratio: effectively infinite at zero paid acquisition

* Payback period: immediate — no upfront costs, Stripe charges customer before serving

# **10\. Scaling Strategy**

## **10.1  Why Cloudflare scales with zero work**

Cloudflare Workers are deployed to 300+ edge locations globally. Every request — including the KV reads that serve shared dashboards — is served from the nearest PoP to the viewer. There is no origin server to scale. JSONBoard has no traditional backend to worry about until very high traffic volumes.

## **10.2  Scaling phases**

| Phase | Actions required |
| :---- | :---- |
| 0 → 10k dashboards/month | Nothing. Free tier handles it. |
| 10k → 100k dashboards/month | Upgrade Cloudflare KV to paid ($5/month). Upgrade Vercel to Pro ($20/month). |
| 100k → 1M dashboards/month | Add R2 for all payloads (not just \>1 MB). Add a Durable Object for rate limiting per IP. Add Cloudflare Waiting Room if viral spike. |
| 1M+ dashboards/month | Evaluate D1 (SQLite on Cloudflare) for Pro user metadata instead of KV. Add analytics pipeline (Cloudflare Analytics Engine — free). Consider dedicated Cloudflare account for enterprise customers. |

## **10.3  The one scaling risk: KV write limits**

Cloudflare KV free tier allows 1,000 writes per day. Each new dashboard create \= 1 write. At 1,000 dashboard creates per day you hit the limit and need the $5/month paid plan. This is a good problem to have — it means 30,000 dashboards created per month — but plan for it in week 4 when you add the KV namespace to a paid Cloudflare account.

## **10.4  Performance targets**

| Metric | Target |
| :---- | :---- |
| Dashboard render (2,000-row payload) | \< 1.5 seconds |
| POST /api/share response time | \< 800ms (p95) |
| GET /d/:slug (shared link load) | \< 400ms (p95, served from edge KV) |
| Chart render (4 charts, 2,000 rows) | \< 500ms |
| Table filter (10,000 rows) | \< 100ms (client-side, no network) |

# **11\. Go-to-Market Strategy**

## **11.1  The viral loop is the GTM strategy**

JSONBoard's primary distribution is the branded footer on every free shared dashboard. This means the product grows from usage, not from marketing spend. The GTM strategy is: make the product so fast and frictionless that developers share dashboards instead of pasting JSON into Slack.

## **11.2  Launch sequencing**

11. Week 1: Ship v1 to Hacker News 'Show HN'. Title: 'Show HN: I built a tool that turns any JSON array into a shareable dashboard in 3 seconds'. This is the audience — developers with JSON problems. Target 200 upvotes.

12. Week 2: Tweet the demo GIF. Show the paste → dashboard → share URL flow in 15 seconds. Target developer Twitter / X audience of existing git-scope followers.

13. Week 3: Post to r/webdev, r/SideProject, r/MachineLearning (JSON \+ API use case). Product Hunt launch prep.

14. Week 4: Product Hunt launch. 'JSONBoard — paste JSON, get a dashboard, share in one click.'

15. Month 2: Build integrations with developer workflow tools — VS Code extension (paste from clipboard), Raycast extension, Warp terminal integration.

## **11.3  ICP (Ideal Customer Profile)**

* Primary: Solo developers and indie hackers with recurring JSON inspection needs

* Secondary: Small engineering teams (2–8 devs) sharing API response data internally

* Tertiary: Developer advocates and technical writers embedding live dashboards in docs

* NOT: Enterprise BI teams, data scientists, SQL-first analysts — those have Metabase

## **11.4  Competitive positioning**

| Competitor | JSONBoard's edge |
| :---- | :---- |
| Metabase | Zero setup. No database required. Works in 3 seconds vs 20 minutes. |
| Grafana | No datasource config. Works with static JSON, not just time-series. |
| Observable / D3 | No code required. Works for non-data-scientists. |
| ChatGPT data analysis | Shareable URL. Permanent link. Works without OpenAI subscription. |
| Quickchart.io | No chart config required. Auto-detects everything. |

## **11.5  The one metric that matters**

Weekly new unique slugs created (i.e. new dashboards shared). If this number grows week-over-week without paid acquisition, the viral loop is working. Everything else — revenue, signups, pageviews — is downstream of this number.

# **12\. Risks & Mitigations**

| Risk | Likelihood | Mitigation |
| :---- | :---- | :---- |
| Cloudflare KV consistency lag (eventual consistency) | Medium | KV is eventually consistent. For the share flow this is fine — the creator gets the URL and shares it; the viewer reads it seconds later. No mitigation needed. |
| JSON with PII / sensitive data shared publicly | Medium | Add a clear warning in the share modal: 'This link is public. Do not share sensitive data.' Password protection (Pro) is the product answer. |
| Abuse: using JSONBoard to host and share malicious JSON payloads | Low | Rate limit POST /api/share to 10 creates per IP per hour. Validate JSON has no executable content (it is data, not code). Add DMCA/abuse email. |
| Competition from Vercel / Cloudflare building similar | Low | They won't. This is too niche. More likely a startup copies. Moat is brand, distribution, and the viral loop already running. |
| Free tier abuse: bots creating thousands of dashboards | Medium | hCaptcha on share button (invisible). Rate limit per IP. KV write costs scale linearly — even 10k bot creates costs \<$1 on paid KV. |
| Stripe SCA / payment failures in India | Medium | Use Stripe's India-optimised checkout. Offer UPI via Stripe (supported). Annual plans reduce failure frequency. |
| Solo founder burnout / product abandonment | High (pattern risk) | Commit to this one product for 90 days minimum. Ship the share link in week 1\. The moment one stranger shares a JSONBoard link, the pattern breaks. |

# **13\. Success Metrics & Milestones**

## **13.1  Weekly metrics to track**

* New dashboards created (primary growth signal)

* Share button click rate (% of dashboard views that result in a share)

* Viewer-to-creator conversion rate (% of viewers who come back to paste their own JSON)

* Free-to-Pro upgrade rate

* MRR and MRR growth rate

## **13.2  Milestone targets**

| Milestone | Target date |
| :---- | :---- |
| v1 live: paste \+ dashboard \+ share link | Week 2 |
| First 100 dashboards created | Week 3 |
| First stranger shares a JSONBoard link (organic) | Week 4 |
| Stripe live, first paying customer | Week 5 |
| Product Hunt launch | Week 6 |
| 25 paying users | Month 3 |
| 100 paying users | Month 6 |
| ₹1 lakh MRR | Month 8 |
| 300 paying users, ₹1 crore ARR path clear | Month 12 |

## **13.3  Definition of 'this is working'**

| The signal that the viral loop is running |
| :---- |
| A user shares a JSONBoard link in a Slack channel or Twitter thread. |
| A teammate or follower clicks it, sees the dashboard, and comes to jsonboard.dev. |
| They paste their own JSON and create a new dashboard. |
| If this happens once per week by Month 2, the product has found its loop. |

# **Appendix A: Worker code skeleton**

The following is the minimal Hono Worker to implement the core three routes. This should be the first code written.

| apps/worker/src/index.ts (skeleton) |
| :---- |
| import { Hono } from 'hono' |
| import { nanoid } from 'nanoid' |
|  |
| type Bindings \= { DASHBOARDS: KVNamespace; BUCKET: R2Bucket } |
| const app \= new Hono\<{ Bindings: Bindings }\>() |
|  |
| app.post('/api/share', async (c) \=\> { |
|   const body \= await c.req.json() |
|   // 1\. Parse \+ validate JSON |
|   // 2\. Check size against plan limit |
|   // 3\. Generate slug \= nanoid(8) |
|   // 4\. Build KV value object |
|   // 5\. c.env.DASHBOARDS.put(slug, JSON.stringify(value), { expirationTtl: 604800 }) |
|   // 6\. Return { slug, url, owner\_key } |
| }) |
|  |
| app.get('/d/:slug', async (c) \=\> { |
|   const slug \= c.req.param('slug') |
|   const raw \= await c.env.DASHBOARDS.get(slug) |
|   if (\!raw) return c.html(expiredHtml(), 404\) |
|   const data \= JSON.parse(raw) |
|   return c.html(viewerHtml(data))  // self-contained HTML |
| }) |
|  |
| app.delete('/api/share/:slug', async (c) \=\> { |
|   const ownerKey \= c.req.header('x-owner-key') |
|   const slug \= c.req.param('slug') |
|   const raw \= await c.env.DASHBOARDS.get(slug) |
|   if (\!raw) return c.json({ error: 'not found' }, 404\) |
|   const data \= JSON.parse(raw) |
|   if (data.owner\_key \!== ownerKey) return c.json({ error: 'forbidden' }, 403\) |
|   await c.env.DASHBOARDS.delete(slug) |
|   return c.json({ deleted: true }, 204\) |
| }) |
|  |
| export default app |

# **Appendix B: wrangler.toml**

| apps/worker/wrangler.toml |
| :---- |
| name \= "jsonboard-worker" |
| main \= "src/index.ts" |
| compatibility\_date \= "2024-01-01" |
|  |
| \[\[kv\_namespaces\]\] |
| binding \= "DASHBOARDS" |
| id \= "your-kv-namespace-id" |
|  |
| \[\[r2\_buckets\]\] |
| binding \= "BUCKET" |
| bucket\_name \= "jsonboard-payloads" |
|  |
| \[triggers\] |
| routes \= \["jsonboard.dev/api/\*", "jsonboard.dev/d/\*"\] |

# **Appendix C: Decision log**

| Decision | Rationale |
| :---- | :---- |
| Hono over Express / Fastify | Runs natively on Cloudflare Workers with zero overhead. Built-in routing, middleware, TypeScript types. |
| KV over D1 (SQLite) | KV has O(1) reads at the edge. D1 is better for relational queries — not needed at launch. |
| Chart.js over Recharts / D3 | Self-contained UMD build embeds in viewer HTML without React. Recharts requires React runtime. |
| nanoid over UUID | 8-char URL-safe IDs are shorter in URLs. UUID is 36 chars. For share URLs, brevity matters. |
| Bun over npm/pnpm | 10x faster installs. Native TypeScript runner. Better fit for solo dev workflow. |
| Vercel for Next.js over Cloudflare Pages | Pages has limited Next.js support. Vercel is the reference platform. Workers handle the API. |
| No database at launch | KV is sufficient for the share link use case. Adding a database adds complexity and cost with no benefit at MVP stage. |

