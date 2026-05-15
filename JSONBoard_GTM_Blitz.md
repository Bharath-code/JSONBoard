# JSONBoard — GTM Blitz, Viral Engine & Conversion Playbook

> **The 30-day aggressive go-to-market plan for JSONBoard**
> Covers: Blitz timeline · B2B playbook · B2C playbook · Viral engine · Free-to-paid conversion

---

## Table of Contents

1. [The Blitz Mindset](#1-the-blitz-mindset)
2. [30-Day Week-by-Week Attack Plan](#2-30-day-week-by-week-attack-plan)
3. [Channel Priority Matrix](#3-channel-priority-matrix)
4. [B2B Playbook](#4-b2b-playbook)
5. [B2C Playbook](#5-b2c-playbook)
6. [B2B + B2C Simultaneously — Why It Works](#6-b2b--b2c-simultaneously--why-it-works)
7. [Viral Engine](#7-viral-engine)
8. [Viral Amplifiers](#8-viral-amplifiers)
9. [Free-to-Paid Conversion — The 5 Moments](#9-free-to-paid-conversion--the-5-moments)
10. [Email Nurture Sequence](#10-email-nurture-sequence)
11. [Friction Removal Checklist](#11-friction-removal-checklist)
12. [The One Number That Tells You It's Working](#12-the-one-number-that-tells-you-its-working)

---

## 1. The Blitz Mindset

Most indie product launches fail because the founder treats it as a single event — one HN post, one tweet, done.

A blitz is different. It's **30 days of coordinated pressure across every channel simultaneously**, so the product appears to be everywhere at once. When someone sees JSONBoard on HN on Monday, then on r/webdev on Wednesday, then a coworker shares a link on Friday — that's not luck, that's the blitz working.

The perception of momentum is itself a growth driver.

> **The single most important milestone in week 1 is not traffic. It's getting one stranger to share a JSONBoard link to someone who didn't ask for it. That moment proves the viral loop is real.**

### Blitz KPIs

| Metric | Target |
|---|---|
| Launch window | 30 days |
| Channels hit simultaneously | 12+ |
| Dashboards created by end of week 4 | 500+ |
| First paying customer | Week 5 |
| K-factor by month 1 | > 0.3 |
| K-factor by month 6 | > 0.6 |

---

## 2. 30-Day Week-by-Week Attack Plan

### Week 1 — Ignite (Days 1–7)

The goal: get the share URL in circulation. Every action this week is about distribution, not polish.

- Ship v1 live to production (paste + dashboard + share link + branded footer)
- Post **Hacker News Show HN** — see exact title and framing in [B2C Playbook](#5-b2c-playbook)
- Post **Twitter/X demo GIF** — show the pain (terminal full of JSON) then the resolution
- Publish **Dev.to post**: "I built a zero-setup JSON dashboard tool — here's how the auto-chart engine works"
- DM 20 developers who have publicly complained about JSON readability on Twitter
- Submit to **BetaList** and **Uneed** for passive discovery

### Week 2 — Amplify (Days 8–14)

The goal: layer on community channels while the HN bump is still warm.

- Post to **r/webdev**, **r/SideProject**, **r/MachineLearning** (JSON + API use case angle)
- Publish **LinkedIn post** targeting technical PMs and engineering leads (B2B angle — see below)
- Post **IndieHackers** journey post with revenue target and architecture transparency
- Reach out to 3 open source projects in your network — offer to embed JSONBoard into their README as a live API response example
- Send **cold email batch 1** — 50 API-first startups (see cold email sequence below)
- Submit to **daily.dev** community

### Week 3 — Scale (Days 15–21)

The goal: build the conversion infrastructure while growing the top of funnel.

- Prepare **Product Hunt** launch assets (tagline, gallery screenshots, maker comment)
- Publish **60-second YouTube demo** — screen record the paste → dashboard → share flow
- Build and publish the **Raycast extension** — one command to paste clipboard JSON and get a dashboard link
- Join 5 relevant **Discord dev servers** and share the tool in #show-and-tell channels
- **Stripe goes live** — Pro plan at $9/month available
- Build the **expiry email trigger** (Resend webhook when KV TTL hits 48h remaining)

### Week 4 — Convert (Days 22–30)

The goal: convert warm users who experienced value in weeks 1–3.

- **Product Hunt launch day** — coordinate upvotes, respond to every comment within 2 hours
- **Retarget week-1 signups** — send the "you've been using JSONBoard for 3 weeks" email with upgrade CTA
- **B2B outreach follow-up** — email 2 of the cold sequence to everyone who opened but didn't reply
- The **expiry emails start firing** for week-1 users — this is your first real conversion moment
- Publish the **"built with JSONBoard" gallery** page — curate the 10 best public dashboards
- Post a **revenue transparency update** on IndieHackers and Twitter (even ₹0 is honest and builds audience)

---

## 3. Channel Priority Matrix

| Channel | Audience | B2B/B2C | Cost | When | Priority |
|---|---|---|---|---|---|
| Hacker News Show HN | Senior devs, technical founders | Both | Free | Day 1 | 🔴 Critical |
| Twitter / X demo GIF | Dev community, indie hackers | B2C | Free | Day 1 | 🔴 Critical |
| Product Hunt | Early adopters, SaaS buyers | B2C | Free | Week 4 | 🔴 Critical |
| LinkedIn post | Engineering leads, PMs, CTOs | B2B | Free | Week 2 | 🟠 High |
| Reddit (r/webdev, r/SideProject) | Web developers | B2C | Free | Week 2 | 🟠 High |
| Dev Discord servers | Active developers | B2C | Free | Week 3 | 🟠 High |
| Cold email outreach | API-first startups | B2B | Free | Week 2 | 🟠 High |
| IndieHackers | Solo founders, indie hackers | B2C | Free | Week 2 | 🟡 Medium |
| Dev.to article | Junior to mid developers | B2C | Free | Week 1 | 🟡 Medium |
| YouTube demo | Broad developer audience | B2C | Free | Week 3 | 🟡 Medium |
| Raycast extension | Power users, macOS devs | B2C | Free | Week 3 | 🟡 Medium |
| BetaList / Uneed | Early adopter community | B2C | Free | Week 1 | 🟢 Low |

---

## 4. B2B Playbook

### B2B ICP — Who Buys Team at $29/month

**API-first startups (5–20 person team)**
- Backend produces JSON payloads daily
- PM or non-technical founder needs to see data without pinging an engineer
- No dedicated data team
- Core need: API ingestion endpoint so dashboards auto-update

**Dev tool companies**
- Build APIs and have developer customers
- Want to embed live dashboards in their docs or status pages
- Core need: embed iframe + no JSONBoard branding

**Freelance agencies**
- Build backends for clients who want to see their data
- JSONBoard = instant client deliverable, zero extra dev time
- Core need: custom slug + password protection for client privacy

**Data / analytics SaaS**
- Their export feature sends JSON; users complain they can't read it
- JSONBoard = white-label dashboard layer for their export files
- Core need: API ingestion + embed iframe

---

### B2B Cold Email Sequence

#### Email 1 — Day 1 (pain-first, zero pitch)

> **Subject:** quick q about your API docs
>
> Hey [name] — noticed [Company] ships a REST API. Quick question: when your team shares API response data internally, what do you use to visualise it?
>
> I'm building something that turns JSON payloads into shareable dashboards in ~3 seconds — no setup, no database, no Docker. Thought it might save your team time.
>
> Happy to send a demo link if useful.
>
> — Bharath

#### Email 2 — Day 4 (attach a demo they didn't ask for)

> **Subject:** made a dashboard from your API (took 8 seconds)
>
> Hey [name] — made a dashboard from your public API endpoint as a demo:
> 👉 jsonboard.dev/d/[slug-you-actually-made]
>
> Took 8 seconds. No login needed to view. If your team produces JSON payloads regularly, this could save hours of copy-pasting into spreadsheets every week.
>
> — Bharath

#### Email 3 — Day 10 (soft close)

> **Subject:** last one
>
> Last one from me — if it's not relevant, totally fine.
>
> Just wanted to leave the link in case a use case comes up: jsonboard.dev
>
> We have a Team plan ($29/mo) with an API ingestion endpoint — you can POST JSON programmatically and always have a live dashboard at the same URL. Happy to set it up together if useful, takes about 10 minutes.
>
> — Bharath

---

### B2B LinkedIn Post (Week 2)

```
Your PM asks "can you show me the API data?"
You spend 20 minutes copying JSON into Google Sheets.

There's a better way.

JSONBoard: paste any JSON array → instant dashboard → shareable link.

Real use cases I've seen in the first week:
→ Backend engineers sharing API response data with non-technical teammates
→ Freelancers delivering live data dashboards to clients
→ Founders monitoring their startup's key metrics from a JSON export

Team plan ($29/mo) includes an API ingestion endpoint — POST JSON programmatically,
get a permanent dashboard URL that auto-updates.

jsonboard.dev — no signup to try it.
```

---

### B2B What To Say / What Not To Say

| ✓ Say this | ✗ Don't say this |
|---|---|
| "Your PM can see API data without pinging an engineer." | "We're like Metabase but simpler." (sounds inferior) |
| "Share a live dashboard in your client report — no screenshots." | "A JSON visualisation tool." (vague, no emotion) |
| "POST to our API endpoint — your dashboard auto-updates." | "Enterprise-ready BI platform." (not what this is) |
| "Zero setup — no Docker, no database, no Grafana." | "Free to try." (undersells; make them feel value first) |
| "Your team sees the data in 3 seconds, not 30 minutes." | "We support JSON arrays up to 50 MB." (spec, not benefit) |

---

## 5. B2C Playbook

### B2C ICP — Who Uses Free + Upgrades to Pro $9/month

**Solo dev / indie hacker**
- Builds in public, has JSON everywhere: API responses, analytics, CI outputs
- Shares findings on Twitter
- The primary viral vector — their shares drive the most new signups
- Converts to Pro when their link expires and they want to keep it

**Backend engineer**
- Debugs JSON payloads daily, pastes to Slack for teammates
- Wants a better alternative to "here's the raw JSON, lol"
- Low friction = instant adoption. Shares with team → team plan entry point

**Technical PM / technical founder**
- Needs quick data views without engineer time
- Exports JSON from tools (PostHog, Mixpanel, Supabase)
- Wants a dashboard link to share with investors or board
- High upgrade intent — sees immediate business value

**Dev advocate / technical writer**
- Shows API responses in tutorials and docs
- JSONBoard link = live, interactive example instead of a static code block
- Embeds in blog posts and documentation sites

---

### B2C Content Playbook

#### Twitter / X — The Demo GIF (Day 1)

**The hook:** show the pain first. Show the resolution second. No feature list.

```
spent 3 seconds on this instead of squinting at it in the terminal

[GIF: terminal full of ugly JSON → paste into JSONBoard → beautiful dashboard → share URL generated]

→ jsonboard.dev
```

**Thread follow-up (post 30 minutes after):**

```
how it works:

→ paste any JSON array
→ auto-detects field types (numeric, categorical, datetime)
→ picks the right chart for each field pair
→ generates a shareable link (jsonboard.dev/d/...)
→ viewer sees the full dashboard, no signup needed

built on Cloudflare Workers + KV — sub-400ms link loads globally
```

---

#### Hacker News Show HN (Day 1)

**Title:** `Show HN: JSONBoard – paste any JSON array, get a shareable dashboard in 3 seconds`

**Pre-write your top comment** (HN rewards technical depth):

```
Hey HN — built this because I was tired of copying API responses into spreadsheets
to share with non-technical teammates.

Technical decisions worth sharing:

1. Auto-chart selection: scores every pair of fields and picks chart types by
   information density. 1 categorical + 1 numeric = bar chart. 2 numerics = scatter.
   Categorical with ≤8 unique values = doughnut. Datetime + numeric = time-series.

2. The shared link is a self-contained HTML file served directly from a Cloudflare
   Worker — no React runtime, no second fetch. Chart.js is inlined. The link will
   render even if my frontend goes down.

3. KV for persistence: Cloudflare KV stores the JSON blob with a 7-day TTL for
   free users. The GET /d/:slug route reads from edge KV — sub-400ms globally.

4. Viral loop: free links have a "Made with JSONBoard" footer. Viewers become
   creators at ~15% rate in early testing.

Happy to go deep on any of this.
```

---

#### Reddit r/webdev (Week 2)

**Title:** `I built a tool that turns JSON into a shareable dashboard instantly — no signup, no setup, just paste`

**Do NOT** write "I made a thing." Lead with the pain.

```
Every backend developer has been here:

"Can you show me the API data?" 
You: [pastes 800 lines of JSON into Slack]
Teammate: "I can't read this"

I built JSONBoard to fix this. Paste any JSON array → instant charts, stats,
and filterable table → shareable link (no signup needed to view).

3 real use cases I've heard from early users:
1. Debugging API responses without grepping through terminal output
2. Sharing analytics payloads with non-technical founders/PMs  
3. Quick data exploration without spinning up a Jupyter notebook

Try it: jsonboard.dev — takes 10 seconds, no account needed.

Happy to answer questions about the architecture (Cloudflare Workers + KV,
auto-chart selection engine, self-contained shared link HTML).
```

---

#### IndieHackers Post (Week 2)

**Title:** `I built JSONBoard in 2 weeks — here's the architecture, GTM plan, and revenue target`

This audience loves transparency. Share everything:
- Revenue target (₹1 crore ARR)
- The Cloudflare KV architecture
- The viral loop design (branded footer → viewer becomes creator)
- The exact conversion triggers (expiry email, size rejection)
- Weekly dashboard creation numbers (even if small)

This drives followers AND backlinks AND future customers who trust you because you showed your work.

---

## 6. B2B + B2C Simultaneously — Why It Works

Most solo founders pick one motion. JSONBoard genuinely serves both, and the two motions reinforce each other.

**The mechanism:**

The B2C motion drives volume — free users, shareable links, branded footer impressions, viral coefficient.

The B2B motion drives revenue per customer — a single Team plan at $29/month earns 3× what a Pro user does, and B2B customers churn far less because the product is embedded in their workflow.

**The critical insight:** B2B buyers discover JSONBoard through B2C behaviour.

An engineering lead at a startup sees their developer share a JSONBoard link in Slack. They click it, see the dashboard, and think *"we could use this for our weekly API report."* That's a bottom-up B2B sale with zero outbound cost. Your B2C viral loop is feeding your B2B pipeline for free.

This is the exact motion that made Notion, Figma, and Linear grow — individual users adopt first, teams pay later.

The LinkedIn and cold email outreach is the proactive B2B layer on top of this organic bottom-up motion. Lead with a live demo they didn't ask for: take their public API endpoint, run it through JSONBoard, and send them the link. That's not a pitch — that's a gift.

---

## 7. Viral Engine

### The Viral Loop — How Each Share Creates New Creators

```
1. Developer pastes JSON
   ↓  (zero friction — no signup)

2. Gets a shareable link
   ↓  (jsonboard.dev/d/abc123 in <30 seconds)

3. Posts link in Slack / Twitter / email
   ↓  (team, followers, or client receives it)

4. Viewer sees dashboard + "Made with JSONBoard" footer
   ↓  (15–40% curiosity click rate on branded footer)

5. Viewer becomes creator — pastes their own JSON
   ↑  (12–20% of footer clicks start a new dashboard)
   └──────────────────────────────────────── loop repeats
```

### K-Factor Targets

| Stage | K-factor | What it means |
|---|---|---|
| Month 1 target | 0.3 | Every 100 creators → 30 more creators via shares |
| Month 6 target | 0.6 | Loop compounding — growth accelerates without more input |
| Self-sustaining | 1.0 | Reached via footer + tweet default + README badge combined |

### Diagnosing the Loop

If new dashboards are NOT being created by strangers by week 4, diagnose:

| Symptom | Root cause | Fix |
|---|---|---|
| High create rate, low share rate | Share button not prominent enough | Move Share button above the fold, make it the primary CTA |
| High share rate, low footer clicks | Footer too subtle / low-contrast | Increase footer contrast, add a small icon |
| High footer clicks, low new creators | Homepage doesn't convert viewers fast enough | Add "you're here because someone shared a dashboard" banner |
| All metrics fine, still flat | Dashboards being shared privately (Slack DMs, email) | Add tweet pre-fill to boost public sharing |

---

## 8. Viral Amplifiers

Beyond the branded footer, these four mechanics compound the viral loop:

### 1. Live creator counter on homepage

```
"4,231 dashboards created today"
```

- Fetches from a KV meta counter key updated on every POST /api/share
- Social proof that the loop is running
- Creates FOMO — someone else is solving this problem; so can you

### 2. Tweet pre-fill (default share copy)

When user clicks Share, pre-fill the tweet:

```
Just made a dashboard from my API response in 3 seconds
→ jsonboard.dev/d/abc123
(via @jsonboard — no signup needed to view)
```

One click to post. A developer with 2,000 followers posting this drives ~50 new visitors with zero effort on your part.

### 3. README badge for open source projects

```markdown
[![View API dashboard](https://jsonboard.dev/badge.svg)](https://jsonboard.dev/d/your-slug)
```

Developers embed this in their OSS README alongside their API documentation. Every GitHub visitor who reads that README sees JSONBoard. Permanent placement, zero ongoing cost.

### 4. "Built with JSONBoard" public gallery

- A curated public page showing the 20 most interesting public dashboards
- Drives discovery: people Google "API response dashboard" and find real examples
- Creates aspiration: new users see what's possible and want to make their own
- SEO benefit: 20+ unique keyword combinations you'd never rank for otherwise
- Gives creators a reason to share their dashboard publicly (being featured)

---

## 9. Free-to-Paid Conversion — The 5 Moments

Ranked by estimated conversion rate. The ranking is deliberate: **loss aversion converts 3× better than feature desire.**

### 🔴 Moment 1: Link expiry email (highest converter, ~8–15%)

**When it fires:** 48 hours before a free link expires (day 5 after creation)

**Subject:** `Your JSONBoard dashboard expires in 2 days`

**Body:**
```
Hi [name],

Your dashboard "[auto-name from top fields]" — shared on [date] — expires on [date+7].

After that, the link will show a 404.

Pro keeps your links for 90 days, removes the JSONBoard branding, and adds 
password protection. $9/month, cancel anytime.

→ Upgrade and keep this dashboard alive: [one-click upgrade link]

— Bharath at JSONBoard
```

**Why it works:** The user already has the dashboard. They shared it. Losing it is loss aversion. Loss aversion converts 3× better than "here's what you'd gain."

---

### 🟠 Moment 2: File size rejection (mid-funnel, ~6–10%)

**When it fires:** User pastes JSON > 1 MB

**Instead of a generic error, show:**

```
This file is 2.3 MB.

Free tier supports up to 1 MB.
Pro supports up to 10 MB — upgrade for $9/month.

[Upgrade to Pro →]    [Learn what else Pro includes →]
```

**Why it works:** Hits at the exact moment of maximum intent. The user is trying to do something right now and can't. Friction-at-the-moment-of-action converts 2–3× better than a settings page CTA.

---

### 🟣 Moment 3: Password protection request (~5–8%)

**When it fires:** Free user clicks "Protect with password" in the share modal

**Show a modal:**

```
Password protection is a Pro feature.

Upgrade for $9/month to:
✓ Password-protect any dashboard
✓ Keep links alive for 90 days (not 7)
✓ Remove the JSONBoard branding
✓ Store up to 10 MB of JSON

[Upgrade to Pro — $9/month →]
```

**Why it works:** The intent is HIGH. They care enough to want privacy — which means they're sharing something sensitive or valuable. That's a signal of serious use.

---

### 🔵 Moment 4: Branded footer click (~2–4%, but high volume)

**When it fires:** Viewer clicks "Made with JSONBoard" footer on a shared dashboard

**Landing page banner:**

```
You're seeing this because someone shared a dashboard with them.

Create yours free → or upgrade to remove the branding from your dashboards.

[Try it free — paste your JSON →]
```

**Why it works:** This is the viral loop completing. The viewer already saw the product working. They're pre-sold on the value before they even land on the homepage.

---

### 🟢 Moment 5: 7th-day in-product nudge (~3–6%)

**When it fires:** 7 days after a user's first dashboard creation

**In-product banner (shown on return visit):**

```
You've created 4 dashboards with JSONBoard.

Your earliest one expires in 6 hours.

Pro gives you 90-day links, password protection, 
and 10× larger file support — $9/month.

[Upgrade to Pro →]    [Maybe later]
```

**Why it works:** The user has established a habit (4 dashboards = they came back). They're now invested. The expiry urgency plus the habit signal together convert well.

---

## 10. Email Nurture Sequence

Triggered on first dashboard creation (capture email at share step with: "Get notified before your link expires →").

| Day | Email | Goal |
|---|---|---|
| Day 0 | Welcome — "Your dashboard is live at [url]. Share it anywhere — no signup needed to view." | Confirm value, set expectation |
| Day 2 | Use cases — "3 ways developers use JSONBoard: debug API responses, share data with PMs, document endpoints with live examples." | Expand mental model of the product |
| Day 5 | Social proof — "150 dashboards created yesterday. Here's the most-shared one this week." (link to gallery) | Build trust, drive return visit |
| Day 7 | Expiry warning — "Your dashboard expires in 2 days. Upgrade to Pro ($9/mo) to extend to 90 days." | Primary conversion trigger |
| Day 9 | Final — "Your first dashboard has expired. Here's everything Pro unlocks. Come back and make it permanent." | Last conversion attempt before churn |

---

## 11. Friction Removal Checklist

The moment you add friction between "I want to do X" and "I did X", conversion drops. Every item below is a deliberate friction removal.

- No signup required to create a dashboard
- No signup required to view a shared link
- Stripe Checkout — no custom payment form, handles SCA automatically
- Upgrade from the expiry email in 1 click (pre-authenticated link)
- UPI support via Stripe (essential for Indian users)
- Annual plan shown at checkout (2 months free — reduces churn at month 1)
- Dashboard history auto-migrates on upgrade (no data loss anxiety)
- Cancel anytime shown prominently — no retention dark patterns
- Mobile-responsive paste UI — works on phone
- Clipboard paste supported — no file upload required

---

## 12. The One Number That Tells You It's Working

By end of week 4, answer this question:

> **Are new dashboards being created by people you have never contacted?**

If **yes** — strangers finding the product through shares, Google, or social — the blitz worked. The viral loop is self-sustaining. Now optimise for conversion.

If **no** — every new user came from your own posts — the loop isn't running. Diagnose:

1. **Share rate too low** → Make the Share button the primary CTA, not secondary
2. **Footer click rate too low** → Increase footer contrast and add the JSONBoard logo
3. **Viewer-to-creator rate too low** → Add the "you're here because someone shared" banner
4. **Sharing privately (Slack DMs)** → Add tweet pre-fill, make public sharing the path of least resistance

---

## Appendix: Launch Day Checklist

### Hour 0–2 (go live)
- [ ] Deploy Worker + Next.js to production
- [ ] Test end-to-end: paste → dashboard → share → view link (incognito)
- [ ] Stripe live mode enabled, Pro plan purchasable
- [ ] Resend emails configured (welcome + expiry)
- [ ] Post HN Show HN — be ready to respond to comments for 4 hours
- [ ] Post Twitter GIF immediately after HN

### Hour 2–6 (amplify)
- [ ] Respond to every HN comment personally
- [ ] Reply to everyone who quotes or shares the tweet
- [ ] DM 10 developer friends and ask them to try it and share feedback
- [ ] Post to personal network on LinkedIn

### Hour 6–24 (capture)
- [ ] Check KV meta counter — how many dashboards created?
- [ ] Check Resend — are welcome emails going out?
- [ ] Check Stripe — any Pro signups?
- [ ] Screenshot the HN post at peak position
- [ ] Write a quick Twitter update: "X dashboards created in the first 12 hours"

### Week 1 end
- [ ] Publish IndieHackers post with honest numbers
- [ ] Begin cold email outreach (B2B batch 1)
- [ ] Post to r/webdev
- [ ] Start Product Hunt prep (screenshots, tagline, maker comment)

---

*Last updated: May 2026 · JSONBoard v1.0 GTM*
