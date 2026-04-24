# SEO Full Audit Report — itrplanner.in
**Scope:** Full-site audit · 6 pages · React SPA  
**Audited:** 2026-04-24  
**Auditor:** Claude Code SEO Skill (LLM-first + script-backed)

---

## A) Audit Summary

**Overall Score: 51/100 — Needs Improvement**  
Score confidence: Medium (PageSpeed/CWV data unavailable due to API rate limit)

### Top 3 Issues
1. **307 Temporary Redirect + Canonical/www Mismatch** — Server does a 307 (temporary) redirect from `itrplanner.in` → `www.itrplanner.in`, but canonical tags site-wide say `https://itrplanner.in/` (non-www). Google sees conflicting signals on which URL is canonical.
2. **No H1 on Homepage** — `HomePage.tsx` has no `<h1>` tag. The most important page on the site is missing its primary heading signal.
3. **FAQPage Schema is Restricted** — Both `index.html` and `SEOHead.tsx` implement `@type: FAQPage`. Google restricted FAQPage rich results to government/healthcare sites in August 2023. Commercial sites will NOT get FAQ rich results from this schema.

### Top 3 Opportunities
1. **Add SSR or Pre-rendering** — The site is a pure client-side React SPA. Server-delivered HTML has only 12 words of text content with zero headings, zero links, zero body text visible to crawlers. Adding SSR (Vite SSR / Next.js) or static pre-rendering would dramatically improve Google's first-pass indexing.
2. **Replace FAQPage with WebSite + Organization Schema** — Remove restricted FAQPage and add `WebSite` (with SearchAction for sitelinks searchbox) and `Organization` schemas to establish brand entity.
3. **Add `/llms.txt`** — AI answer engines (Perplexity, ChatGPT, Claude) increasingly use this file for citation decisions. A high-quality llms.txt would improve visibility in AI-powered search results for tax queries.

---

## B) Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|------|----------|------------|---------|----------|-----|
| Technical | 🔴 Critical | Confirmed | 307 temporary redirect from non-www to www | `redirect_checker.py`: `itrplanner.in` → 307 → `www.itrplanner.in` | Change to 301 permanent redirect at hosting/CDN level |
| Technical | 🔴 Critical | Confirmed | Canonical says non-www; resolved URL is www | `canonical: https://itrplanner.in/` in HTML; final URL is `https://www.itrplanner.in/` | Choose one canonical form (recommend non-www), configure 301 redirect, update canonical |
| Technical | 🔴 Critical | Confirmed | SPA CSR — zero indexable content in static HTML | `parse_html.py`: H1: [], H2: [], links.internal: [], word_count: 14 | Add SSR (Vite SSR / Next.js) or static pre-rendering per page |
| On-Page | 🔴 Critical | Confirmed | Homepage has no H1 tag | `HomePage.tsx` reviewed: no `<h1>` element; `HomePageContent` starts at H2 | Add `<h1>` to `HomePage.tsx`, e.g. "Free Income Tax Calculator India FY 2026-27" |
| Schema | 🔴 Critical | Confirmed | FAQPage schema used on commercial site — restricted since Aug 2023 | `validate_schema.py`: status "restricted"; used in `index.html` and `SEOHead.tsx` (HRA, NewVsOldRegime pages) | Remove all FAQPage schema blocks; add WebSite + Organization schema |
| Technical | ⚠️ Warning | Confirmed | Stale dist/index.html with wrong domain (taxcalculator.in) | `dist/index.html`: `canonical href="https://taxcalculator.in/"`, all OG URLs wrong domain; GA script missing | Rebuild dist from source before any deployment; add pre-deployment check |
| Technical | ⚠️ Warning | Confirmed | Missing 5 security headers; HSTS lacks includeSubDomains | `security_headers.py`: score 45/100; missing CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | Add headers via hosting config (Cloudflare / Vercel / Nginx) |
| Technical | ⚠️ Warning | Confirmed | 8 AI crawlers not explicitly managed in robots.txt | `robots_checker.py`: ClaudeBot, PerplexityBot, ChatGPT-User, Applebot-Extended, CCBot, anthropic-ai, FacebookBot, Amazonbot inherit wildcard | Add explicit allow/disallow for each AI crawler per strategy |
| Technical | ⚠️ Warning | Confirmed | robots.txt contains placeholder developer comment | Line 2: `# Replace itrplanner.in with your actual domain before deploying.` | Remove placeholder comment from production robots.txt |
| GEO | 🔴 Critical | Confirmed | No llms.txt file | `llms_txt_checker.py`: HTTP 404 for both /llms.txt and /llms-full.txt | Create /llms.txt with site purpose, key pages, and instructions for AI crawlers |
| Schema | ⚠️ Warning | Confirmed | No Organization or WebSite schema | `parse_html.py` schema output: only WebApplication + FAQPage | Add `Organization` and `WebSite` (with SearchAction) JSON-LD blocks |
| Schema | ⚠️ Warning | Likely | BreadcrumbList schema injected dynamically via JS | `SEOHead.tsx`: uses `useEffect` + `document.head.appendChild` | BreadcrumBS schema should be in the static HTML shell or SSR output, not DOM-injected |
| On-Page | ⚠️ Warning | Confirmed | PWA manifest only has SVG icon, no PNG icons | `manifest.json`: only `favicon.svg` listed | Add 192×192 and 512×512 PNG icons to manifest |
| On-Page | ℹ️ Info | Confirmed | twitter:site and twitter:creator missing | `social_meta.py`: score 85/100; both optional fields absent | Add `<meta name="twitter:site" content="@yourhandle">` if you have a Twitter account |
| Content | ⚠️ Warning | Confirmed | Server-delivered HTML has 12 words — thin content to crawlers | `readability.py`: word_count: 12; `parse_html.py`: word_count: 14 | SSR or pre-rendering is the fix; not a content quality issue per se |
| Content | ✅ Pass | Confirmed | Rich, accurate tax content on inner pages | HomePageContent, HRA, NewVsOld, IncomeTaxSlabs pages all have 500–1500+ words of relevant content | Maintain |
| Content | ✅ Pass | Confirmed | Author identified, data sources cited, disclaimer present | AboutPage: Abhishek Das + GitHub; Footer: disclaimer; IncomeTaxSlabsPage: "Last updated: April 2026" | Maintain |
| On-Page | ✅ Pass | Confirmed | Unique keyword-rich title tags on all 6 pages | Verified: each page has distinct, descriptive title under 70 chars | Maintain |
| On-Page | ✅ Pass | Confirmed | Meta descriptions on all pages, proper length | All pages: 130–165 chars, descriptive, keyword-relevant | Maintain |
| On-Page | ✅ Pass | Confirmed | Canonical tags present on all pages | `SEOHead.tsx` always renders canonical via react-helmet-async | Maintain (fix www/non-www mismatch first) |
| Technical | ✅ Pass | Confirmed | HTTPS enabled with HSTS | `security_headers.py`: HTTPS yes; HSTS max-age=63072000 | Add includeSubDomains to HSTS |
| Technical | ✅ Pass | Confirmed | Sitemap.xml present, all 6 pages listed, correct priorities | `sitemap.xml` verified: all routes present with correct priorities | Maintain; update lastmod dynamically |
| Technical | ✅ Pass | Confirmed | Preconnect for Google Fonts in head | `index.html`: `<link rel="preconnect" href="https://fonts.googleapis.com">` | Maintain |
| Technical | ✅ Pass | Confirmed | Semantic HTML throughout (main, nav, footer, aria-label) | `App.tsx`, all pages: `role="main"`, `aria-label`, `role="contentinfo"` | Maintain |
| Social | ✅ Pass | Confirmed | Open Graph fully implemented; score 85/100 | `social_meta.py`: 7/7 OG tags; Twitter 4/6 | Maintain; add twitter:site/creator |
| Accessibility | ✅ Pass | Confirmed | Skip-to-content link present | `App.tsx`: `<a href="#main-content" className="sr-only focus:not-sr-only">` | Maintain |
| Internal Linking | ✅ Pass | Confirmed | Footer + HomePageContent + nav link all inner pages | Footer, Header nav, HomePageContent "Related Tools" section all interconnect pages | Maintain |
| Hreflang | ℹ️ Info | Confirmed | No hreflang — not needed for India-only tool | Site targets `en-IN` only; no multi-language/region expansion | Not applicable for current scope |

---

## C) Category Scores

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Technical SEO | 25% | 35/100 | Critical redirect mismatch + SPA CSR delivery |
| Content Quality | 20% | 68/100 | Excellent page content; delivery via JS is the bottleneck |
| On-Page SEO | 15% | 62/100 | Strong metadata but missing homepage H1, restricted FAQ schema |
| Schema / Structured Data | 15% | 45/100 | WebApplication valid; FAQPage restricted; BreadcrumbList via JS |
| Performance (CWV) | 10% | N/A | API rate-limited; lab score insufficient data |
| Image Optimization | 10% | 60/100 | OG image correct dimensions; no alt-text issues found; no LCP image preload |
| AI Search Readiness (GEO) | 5% | 30/100 | No llms.txt; incomplete AI crawler rules; Google-Extended explicitly allowed ✅ |

**Weighted Total: ~51/100 (Needs Improvement)**

---

## D) Detailed Findings

### D1. The SPA Indexing Problem (Most Impactful)

The site is a pure client-side React SPA built with Vite. When Googlebot fetches `https://itrplanner.in/`, the server delivers:

```html
<div id="root"></div>
<script type="module" src="/assets/index-DGcZ2-Qt.js"></script>
```

Zero H1s. Zero body text. Zero internal links. Googlebot must execute the JavaScript bundle, wait for React to mount, and then re-index. This "secondary indexing wave" can take days to weeks, particularly for new or low-authority pages. During this window, the page competes in Google with essentially no content signal.

**Why this matters for itrplanner.in specifically:**
- Target keywords like "income tax calculator india 2026-27" are highly competitive
- YMYL-adjacent queries (finance) require Google's highest confidence in content quality
- The 307 redirect delay (265ms total) compounds JS execution time for LCP

**Recommended fix:** Implement Vite SSR or migrate to Next.js with static generation (SSG) for all calculator pages. Each route should pre-render the full HTML including H1, H2 headings, FAQ content, and internal links in the initial server response.

---

### D2. Canonical / Redirect Conflict (Quick Win)

Current state:
- User navigates to `https://itrplanner.in/` 
- Server returns **307 Temporary Redirect** to `https://www.itrplanner.in/`
- All canonical tags in HTML say `https://itrplanner.in/` (non-www)

This creates three problems:
1. Google sees conflicting signals: canonical says non-www, but the URL that returns 200 is www
2. 307 is temporary — Google interprets this as "this redirect may change" and is less confident consolidating signals
3. Link equity and crawl budget are split between two URL forms

**Fix:** In your CDN/hosting:
1. Change redirect type from 307 to 301 permanent
2. Decide canonical form. Non-www (`itrplanner.in`) is fine — just ensure the 301 and canonical agree
3. Update sitemap URLs and OG `og:url` to match chosen canonical

---

### D3. FAQPage Schema — Commercial Site Restriction

Google's August 2023 guidance explicitly restricted FAQPage rich results to government and healthcare authority sites. Commercial finance tools like itrplanner.in are excluded. Having FAQPage schema won't get you the accordion rich result, and it may slightly confuse Google's understanding of the page type.

**Current usage:**
- `index.html`: static FAQPage block with 5 questions
- `SEOHead.tsx`: dynamic FAQPage injection for `/hra-calculator` and `/new-vs-old-regime` pages

**What to replace with:**
- `WebSite` schema with `SearchAction` (enables sitelinks searchbox in Google)
- `Organization` schema (establishes brand entity, aids Knowledge Panel)
- Keep `WebApplication` schema on homepage — this is valid and appropriate ✅
- Keep `BreadcrumbList` schema — this is valid and gets rich results ✅

The FAQ content on the page is excellent and should remain as HTML — just remove the JSON-LD FAQPage blocks.

---

### D4. Homepage Missing H1

`HomePage.tsx` structure:
```
<Header> → Navigation tabs
<main> → Grid with ProfileCard, IncomeCard, DeductionsCard | ResultsPanel
<HomePageContent> → starts with <h2>How to Use This Income Tax Calculator</h2>
```

There is no `<h1>` anywhere on the homepage. Every other page (HRA, NewVsOld, IncomeTaxSlabs, About) has a clear H1. The homepage is the most important page for the target keyword "income tax calculator india" and it has no primary heading.

**Fix:** Add `<h1>` at the top of the calculator `<main>` section in `HomePage.tsx`:
```tsx
<h1 className="text-3xl font-bold text-slate-800 mb-2">
  Free Income Tax Calculator India — FY 2026-27
</h1>
<p className="text-slate-500 text-sm mb-6">
  Compare New Regime vs Old Regime instantly. Based on Income Tax Act 2025.
</p>
```

---

### D5. Stale dist/index.html

`dist/index.html` was built against an old domain (`taxcalculator.in`):
- `canonical href="https://taxcalculator.in/"` — wrong domain
- All OG URLs point to `taxcalculator.in` — wrong domain
- Google Analytics script is absent from dist — no tracking in production
- Schema URLs reference `taxcalculator.in` — wrong domain

If this `dist/` folder is ever accidentally deployed, it would cause a significant indexing disaster. Add a pre-deployment validation script or CI check.

---

### D6. Security Headers

Current security score: **45/100**. The hosting serves HSTS correctly but is missing 5 standard headers:

| Header | Priority | Value to Set |
|--------|----------|-------------|
| `X-Content-Type-Options` | High | `nosniff` |
| `X-Frame-Options` | High | `SAMEORIGIN` |
| `Referrer-Policy` | Medium | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Medium | See CSP builder |
| `Permissions-Policy` | Low | `camera=(), microphone=(), geolocation=()` |

These are configurable at CDN/hosting level (Vercel, Cloudflare, or Nginx config). No code changes required.

---

### D7. robots.txt Issues

**Issue 1 — Placeholder comment left in production:**
```
# Replace itrplanner.in with your actual domain before deploying.
```
This is a development note that should be removed from production.

**Issue 2 — AI crawlers not fully managed:**
Explicitly managed: GPTBot (blocked), Google-Extended (allowed), Bytespider (blocked)
Not managed: ClaudeBot, PerplexityBot, ChatGPT-User, Applebot-Extended, CCBot, anthropic-ai, FacebookBot, Amazonbot

Recommended additions (they inherit `*: Allow /` currently):
```
User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ChatGPT-User
Allow: /
```

---

### D8. No llms.txt (AI Search Readiness Gap)

With AI answer engines (ChatGPT, Perplexity, Claude) increasingly being used for tax queries, a `/llms.txt` file helps ensure your site is cited correctly and comprehensively.

**Suggested `/llms.txt`:**
```
# itrplanner.in — India Income Tax Calculator

> Free, open-source income tax calculator for India (FY 2026-27).
> Compares New Tax Regime vs Old Tax Regime. Based on Income Tax Act 2025.

## Key Pages

- [Income Tax Calculator](https://itrplanner.in/): Main calculator — compare both regimes
- [New vs Old Regime](https://itrplanner.in/new-vs-old-regime): Side-by-side comparison
- [HRA Exemption Calculator](https://itrplanner.in/hra-calculator): HRA tax benefit calculator
- [Income Tax Slabs 2026-27](https://itrplanner.in/income-tax-slabs): Complete slab reference
- [About](https://itrplanner.in/about): Data sources and methodology

## Coverage

FY 2026-27 (AY 2027-28). New Regime, Old Regime, all age groups (under 60, senior, super senior).
Deductions: 80C, 80D, 80CCD, 24(b), HRA. Surcharge and cess included. Marginal relief not computed.
```

---

## E) Unknowns and Follow-ups

| Check | Status | How to Resolve |
|-------|--------|---------------|
| Core Web Vitals (LCP, INP, CLS) | Unknown — API rate limited | Run `pagespeed.py https://itrplanner.in --strategy mobile` after 5 min; or check Google Search Console |
| Google Search Console indexing status | Unknown | Verify in GSC which pages are indexed and in what state |
| CrUX field data | Unknown | Check CrUX API or Google Search Console Core Web Vitals report |
| Actual Google-rendered HTML | Unknown | Use Google Search Console's "Inspect URL" tool with "Test Live URL" to see what Google renders |
| Schema rich result eligibility | Confirmed issue | Use Google's Rich Results Test on each page |
| Actual organic ranking positions | Unknown | Check Google Search Console Performance report |

---

## F) E-E-A-T Assessment

| Signal | Status | Notes |
|--------|--------|-------|
| Experience | ⚠️ Partial | Creator identified (Abhishek Das); no formal tax credentials listed |
| Expertise | ⚠️ Partial | Tax data sourced from Income Tax Act 2025, Union Budget 2026; no CA review mentioned |
| Authoritativeness | ⚠️ Partial | Open source on GitHub; no external backlinks or citations found |
| Trustworthiness | ✅ Good | Disclaimer prominent; privacy policy exists; no data collection stated; HTTPS |

**Recommendation:** Add a note on the About page that calculations have been verified by a CA or that the tool references official government sources with links to incometax.gov.in. External backlinks from tax/finance publications would significantly strengthen authoritativeness.
