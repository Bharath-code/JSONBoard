# JSONBoard — Context

## Product

**JSONBoard** is a zero-setup, browser-based JSON visualization tool. Users paste a JSON array and receive an interactive dashboard with auto-generated charts, a filterable data table, and a shareable URL — no signup required.

**One-line pitch:** Metabase for people who just have JSON and 30 seconds.

## Glossary

| Term | Definition |
|------|------------|
| **Dashboard** | A visualized JSON payload: stat cards, up to 4 charts, and a filterable table. Created by pasting JSON into the app. |
| **Slug** | An 8-character nanoid that uniquely identifies a shared dashboard. Forms the share URL: `jsonboard.dev/d/{slug}`. |
| **Share link** | A public URL that renders the dashboard for anyone with the link. No signup required. |
| **Owner key** | A random 32-character token returned at dashboard creation, stored in localStorage. Used to delete a dashboard. Not tied to a user account. |
| **Viewer** | The self-contained HTML page served by the Cloudflare Worker for shared dashboards. Depends on Chart.js from cdnjs. |
| **Free user** | An anonymous user who pastes JSON and creates a dashboard. No account, no login. |
| **Pro user** | A paying user ($9/mo) identified by a signed JWT cookie. Gets extended TTL, password protection, custom slug, CSV export. |
| **Team** | A paying workspace ($29/mo) with API ingestion, embed iframe, and 5 seats. Not in MVP. |

## Architecture Decisions

### Framework: SvelteKit
- SvelteKit replaces Next.js from the original PRD
- Rationale: smaller bundles (~30 KB vs ~120 KB), no virtual DOM overhead, better fit for data-heavy dashboard rendering
- SSR for fast initial load, deploys to Vercel
- The shared viewer is framework-independent (HTML + Chart.js from cdnjs)

### Auth: Stripe Checkout + JWT Cookie
- No login system, no password, no OAuth at MVP
- Pro users pay via Stripe Checkout → redirected back with session_id → Next.js verifies → sets signed JWT cookie
- Cookie contains `{plan: 'pro', exp: subscription_end_date}`, signed with shared secret
- Cloudflare Worker verifies JWT signature and expiry on Pro-gated routes
- Subscription cancellation: JWT expires naturally at billing period end; user loses Pro access then
- Recovery: via Stripe Customer Portal (email-based)

### Persistence: Cloudflare KV Only (No Database at MVP)
- KV stores dashboards by slug: `d:{slug}`
- KV has eventual consistency — acceptable for share link pattern
- No D1 (SQLite) at launch; dashboard history deferred

### Rate Limiting: KV Counters
- KV-based counters with eventual consistency for IP-based rate limiting
- 10 dashboard creates per IP per hour
- 5 failed password attempts lock viewer for 10 minutes
- Team API rate limiting (100 req/min per workspace) deferred until Team tier ships

### Password Hashing: PBKDF2 via Web Crypto API
- bcrypt is too slow in Cloudflare Workers (~500ms per hash)
- PBKDF2 via `crypto.subtle.deriveBits()` runs natively, ~10ms verification
- Password verification: form POST with full reload, no AJAX

### DNS/Routing
- Cloudflare as DNS proxy
- Vercel as origin for main app (SvelteKit)
- Cloudflare Worker handles `/api/*` and `/d/*` routes
- Single domain ensures cookies flow to both infrastructures

## MVP Scope

### In Scope (Free Tier)
- JSON paste + validation
- Auto-chart generation (up to 4 charts)
- Stat cards (row count, field count, sum/avg for numeric fields)
- Filterable data table with search and sort
- Shareable link generation (7-day TTL)
- Branded footer on free shared dashboards ("Made with JSONBoard")

### In Scope (Pro Tier — Week 4+)
- Password protection on shared dashboards
- 90-day link TTL
- Custom slug
- CSV export
- No branded footer on shared views

### Deferred from MVP
- **Dashboard history** (F-07) — retention feature, not conversion feature. Add D1 when 50+ Pro users ask for it.
- **Expiry emails** (8.2) — proactive "your link expires in 2 days" emails. Add in Week 6-8 after real usage data.
- **Custom domain** (Team tier) — enterprise feature, disproportionate complexity at $29/mo. Revisit at Month 6.
- **Team API ingestion** (F-08) — build only after 3+ Pro users mention teammates or API use cases.
- **Embed iframe** (F-09) — Team feature, deferred.
- **Live counter** ("X dashboards created today") — social proof added when there's actual traction.
- **hCaptcha** — rate limiting is sufficient abuse guardrail at launch. Add reactively if abuse patterns appear.

## Technical Specifications

### Chart Engine

**Field Type Detection** (run on first 100 rows per field):
1. Boolean: all values are `true`/`false`/`1`/`0`
2. Numeric: all values parse as numbers AND field name doesn't match `/id|_id|code|zip|phone/`
3. Datetime: all values parse via `Date.parse()` OR field name matches `/date|time|_at|_on|created|updated/`
4. Currency/percent: values match `/^\$[\d,]+\.?\d*$/` or `/^\d+%$/` → strip symbols, treat as numeric
5. Categorical: string type AND unique values ≤ 50
6. Fallback: string (display in table only)

**Chart Selection Scoring** (0–100 per candidate):
- Base: categorical+numeric = 70, two numerics = 60, single numeric = 40, boolean = 30
- Cardinality bonus: 3–12 unique values = +15, <3 or >20 = -20
- Variance bonus: high std dev relative to mean = +10
- Name signal: `date`, `time`, `_at`, `revenue`, `count`, `amount`, `total` = +10
- Correlation (scatter only): |r| > 0.5 = +20
- Top 4 scoring combinations render. Nothing above 30 → single histogram of first numeric field.

**Downsampling** (for payloads > 10,000 rows):
- Scatter plots: systematic sampling (every nth row)
- Line/time-series: Largest-Triangle-Three-Buckets (LTTB) algorithm

**Nested JSON Handling**:
- Objects recursively flatten to dot-notation columns (e.g., `user.address.city`)
- Maximum depth: 3 levels, then stringify
- Arrays always stringified

**Chart Library**: Chart.js 4 (UMD build from cdnjs.cloudflare.com)
**Animations**: Chart.js native animations + CSS transitions only. No animation library.

### Components
- Custom-built, no UI component library
- ~6 components: JsonInput, Dashboard, ChartCard, StatCard, DataTable, ShareModal
- Tailwind CSS for styling

### Demo Datasets
- Three examples hardcoded in frontend bundle: Sales, API logs, Users
- ~100 rows each, ~15 KB total

### UX Decisions
- "New dashboard" button: hard reset to paste input. If dashboard was shared, save slug to localStorage for recovery.
- Shared viewer depends on Chart.js from cdnjs — messaging is "no account/framework required," not "works offline."

## Financial Targets

| Metric | Month 3 | Month 12 |
|--------|---------|----------|
| Unique dashboards/week | 500+ | 5,000+ |
| Paying users | 25 | 300 |
| MRR | ₹18,000 | ₹2,20,000 |

**Pricing**: Free | Pro $9/mo | Team $29/mo

## Infrastructure Cost

- Launch: ~₹100/month (domain only). All other services on free tiers.
- Month 12: ~₹13,850/month (paid Cloudflare, Vercel Pro, Stripe fees, Resend, Clerk)
- 96% net margin at Month 12
