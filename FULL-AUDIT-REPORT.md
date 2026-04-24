# Full SEO Audit Report — itrplanner.in
**Scope:** Full-site audit (6 pages)  
**Date:** 2026-04-24  
**Overall Rating:** Good — 66/100  
**Score Confidence:** Medium (PageSpeed API rate-limited; CWV scored from codebase evidence)

---

## A) Audit Summary

**Top 3 Issues**
1. 594 KB `jsPDF` PDF-export bundle loads eagerly on every page (all ~1.08 MB JS uncompressed) — direct LCP/INP risk
2. Thin content on HRA Calculator (333 words) and About (297 words) — weak for competitive SERPs
3. Missing `Content-Security-Policy` header — security and trust signal gap

**Top 3 Opportunities**
1. Lazy-load PDF export and all route pages with `React.lazy` — immediate JS payload reduction
2. Expand HRA Calculator and About page content — strengthens E-E-A-T and ranking potential
3. Shorten OG/title tag (77→60 chars) and add `twitter:site` — improves CTR in social previews

---

## B) Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|------|----------|------------|---------|----------|-----|
| Performance | ⚠️ Warning | Confirmed | 594 KB `jsPDF` loaded on every page load, not just on download click | `dist/assets/pdf-export-DeSgX5Ne.js` = 593,872 bytes; `DownloadButton.tsx` imports `reportGenerator.ts` at module level; `App.tsx` imports all pages eagerly | Dynamically import `reportGenerator.ts` inside the `handle()` function; add `React.lazy` + `Suspense` for all routes in `App.tsx` |
| Performance | ⚠️ Warning | Confirmed | All 6 route pages eagerly imported in `App.tsx` — no code splitting | `App.tsx` lines 3-10 use static imports for all page components | Replace with `React.lazy(() => import('./pages/...'))` and wrap routes in `<Suspense>` |
| Security | ⚠️ Warning | Confirmed | `Content-Security-Policy` header missing | `security_headers.py` output: ❌ CSP missing; `vercel.json` headers do not include CSP | Add CSP to `vercel.json` headers: `"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; img-src * data:; font-src 'self' https://fonts.gstatic.com"` |
| Content | ⚠️ Warning | Confirmed | HRA Calculator page has only 333 words — borderline thin for finance SERPs | `parse_html.py` on `/hra-calculator`: `word_count: 333` | Add a 300–500-word explainer section: how HRA exemption is calculated, metro/non-metro rules, worked examples, common mistakes |
| Content | ⚠️ Warning | Confirmed | About page has only 297 words | `parse_html.py` on `/about`: `word_count: 297` | Expand with methodology, changelog/update history, CA review notice, contact section |
| On-Page | ⚠️ Warning | Confirmed | Homepage OG title is 77 chars (max 60 recommended for social previews) | `social_meta.py`: `⚠️ og:title is too long (77 chars, max 60)` | Shorten: "Income Tax Calculator India FY 2026-27 \| New vs Old Regime" (58 chars) and update `SEOHead.tsx` homepage call |
| Schema | ⚠️ Warning | Likely | `SearchAction` urlTemplate uses `?q=` but the site has no functional search engine | `index.html` schema: `"urlTemplate": "https://itrplanner.in/?q={search_term_string}"` — React SPA ignores this param | Remove `SearchAction` from `WebSite` schema or implement actual search via query-string routing |
| On-Page | ℹ️ Info | Confirmed | `twitter:site` and `twitter:creator` handles missing | `social_meta.py`: `ℹ️ twitter:site: missing (optional)` | Add `<meta name="twitter:site" content="@handle">` in `SEOHead.tsx` if a Twitter/X account exists |
| Schema | ℹ️ Info | Confirmed | `WebApplication.dateModified` hardcoded to `2026-04-20` in `index.html` — will go stale | `index.html` schema block: `"dateModified": "2026-04-20"` (static string) | Auto-update via build script or update with each deploy |
| E-E-A-T | ℹ️ Info | Likely | Author listed as "Software Developer" only — no CA/CFA domain credential | `AboutPage.tsx`: `jobTitle: 'Software Developer'`; no professional tax qualification cited | Add "Tax data reviewed by CA [Name]" or "Last reviewed: [date]" signal in disclaimer |
| Content | ℹ️ Info | Confirmed | Income Tax Slabs page: 554 words (acceptable but thin for a reference page) | `parse_html.py` on `/income-tax-slabs`: `word_count: 554` | Add surcharge table, cess breakdown, Old Regime senior-citizen slabs, worked tax examples |
| Technical | ✅ Pass | Confirmed | HTTPS, clean redirect chain (0 hops, 83ms TTFB) | `redirect_checker.py`: `✅ [200] https://itrplanner.in (83ms) — FINAL` | — |
| Technical | ✅ Pass | Confirmed | robots.txt present with correct AI crawler management | `robots_checker.py`: allows ClaudeBot, PerplexityBot, Google-Extended, ChatGPT-User; blocks GPTBot, CCBot, Bytespider, anthropic-ai | — |
| Technical | ✅ Pass | Confirmed | sitemap.xml valid with 6 URLs, correct priorities and lastmod | `sitemap.xml` reviewed: all pages indexed, priorities 1.0→0.2, lastmod 2026-04-20 | — |
| Technical | ✅ Pass | Confirmed | All 6 pages have correct self-referencing canonical tags | `parse_html.py` outputs for all pages: canonical matches page URL | — |
| Technical | ✅ Pass | Confirmed | SSR pre-rendering active — all pages have server-rendered HTML in `dist/` | `dist/` contains pre-rendered `index.html` for each route | — |
| Technical | ✅ Pass | Confirmed | 5/6 security headers present (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | `security_headers.py`: Score 85/100 | — |
| Technical | ✅ Pass | Confirmed | 0 broken links across all crawled pages | `broken_links.py`: Total 8 links, 8 healthy, 0 broken | — |
| On-Page | ✅ Pass | Confirmed | All 6 pages have unique titles, meta descriptions, and single H1 | `parse_html.py` on all pages: unique title+desc, exactly 1 H1 | — |
| On-Page | ✅ Pass | Confirmed | Good heading hierarchy H1 → H2 → H3 throughout site | Homepage H2s include: "How to Use", "Tax Slabs", "New vs Old Regime", "FAQ", "Related Calculators" | — |
| On-Page | ✅ Pass | Confirmed | BreadcrumbList schema on all sub-pages | `parse_html.py` on `/new-vs-old-regime`, `/hra-calculator`, `/income-tax-slabs`, `/about`: all include BreadcrumbList | — |
| Social | ✅ Pass | Confirmed | OG tags complete (type, url, title, desc, image 1200×630, site_name, locale) | `social_meta.py`: 7/7 OG tags present, Score 85/100 | — |
| GEO | ✅ Pass | Confirmed | `llms.txt` present, 95/100 quality; `llms-full.txt` also present | `llms_txt_checker.py`: Status 200, Score 95/100, 4 sections, 5 links | — |
| Schema | ✅ Pass | Confirmed | WebApplication, WebSite, Organization schema on all pages; Person schema on About | `parse_html.py` across all pages: schema types confirmed | — |
| E-E-A-T | ✅ Pass | Confirmed | Data sources cited: Income Tax Act 2025, Union Budget 2026, official gazette | `AboutPage.tsx` Data Sources section: 4 bullet points with sources | — |
| E-E-A-T | ✅ Pass | Confirmed | Disclaimer present on About page | `AboutPage.tsx`: amber disclaimer box advising CA consultation | — |
| Content | ✅ Pass | Confirmed | Readability appropriate for finance audience (Flesch 53.2, Grade 8.9) | `readability.py`: Flesch 53.2, grade level 8.9, reading level "Difficult (9th-12th grade)" | — |
| PWA | ✅ Pass | Confirmed | PWA manifest with correct icons (192px, 512px maskable), categories: finance | `manifest.json` reviewed: all required fields present | — |
| Technical | ✅ Pass | Confirmed | `lang="en-IN"` set on `<html>` — correct locale signal | `index.html` line 1: `<html lang="en-IN">` | — |

---

## C) Category Scores

| Category | Weight | Score | Rating |
|----------|--------|-------|--------|
| Technical SEO | 25% | 75/100 | Good |
| Content Quality | 20% | 52/100 | Needs Improvement |
| On-Page SEO | 15% | 61/100 | Needs Improvement |
| Schema / Structured Data | 15% | 78/100 | Good |
| Performance (CWV) | 10% | 45/100 | Poor* |
| Image Optimization | 10% | 70/100 | Good |
| AI Search Readiness (GEO) | 5% | 95/100 | Excellent |
| **Overall** | **100%** | **66/100** | **Good** |

*Performance score `Confidence: Hypothesis` — derived from bundle analysis since PageSpeed API was rate-limited.

### Score Derivations

**Technical SEO (75):** HTTPS, canonical, robots.txt, sitemap, lang, SSR, no broken links all confirmed (+8). Missing CSP (Warning −5) = 80 − 5 = **75**.

**Content (52):** Homepage 1,313w and New vs Old 762w solid; FAQ present; data sources cited (+5). HRA at 333w and About at 297w thin (Warning×2 −10); no CA credentials (Warning −5) = 67 − 15 = **52**.

**On-Page (61):** Unique titles/descriptions/H1 on all pages, heading hierarchy, breadcrumbs (+5). Title too long, OG title too long (Warning×2 −10) = 71 − 10 = **61**.

**Schema (78):** Correct WebApplication, WebSite, Organization, BreadcrumbList, Person (+5). SearchAction non-functional (Warning −5) = 83 − 5 = **78**.

**Performance (45):** SSR prerendering, react-vendor chunk split (+2). 594KB PDF bundle eager (Warning −5), no route lazy-loading (Warning −5) = 55 − 10 = **45** (Hypothesis).

**Images (70):** No calculator images to optimize (N/A for img audit). OG image correct 1200×630, SVG favicon, PWA icons all valid. Adjusted neutral = **70**.

**GEO (95):** llms.txt 95/100, llms-full.txt present, AI answer crawlers explicitly allowed, training crawlers blocked = **95**.

---

## D) Unknowns and Follow-ups

| Item | What's Needed | How to Confirm |
|------|---------------|----------------|
| Core Web Vitals (LCP, INP, CLS) | Actual PageSpeed/CrUX data | Run `pagespeed.py` off-peak or with a Google API key |
| Mobile rendering fidelity | Screenshot analysis | Install Playwright + `capture_screenshot.py https://itrplanner.in --all` |
| Actual SERP positions | GSC Performance data | Google Search Console → Performance → filter by page |
| Index coverage | Any excluded/noindexed URLs | Google Search Console → Coverage report |
| Backlink profile | No external link data collected | Run `seo links` sub-skill with Ahrefs/Majestic API |
| SearchAction efficacy | Does Google show sitelinks search box? | GSC → Search Appearance → Sitelinks |

---

## E) Environment Limitations

- **PageSpeed Insights API:** Rate-limited throughout audit (no API key provided). CWV findings are `Confidence: Hypothesis` derived from JS bundle analysis. Run `pagespeed.py` with `--api-key` at off-peak hours.
- **Playwright screenshots:** Not installed — visual analysis skipped.
- **Backlink data:** Not available without a third-party API (Ahrefs, Majestic, Moz).
