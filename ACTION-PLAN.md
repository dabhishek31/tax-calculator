# SEO Action Plan — itrplanner.in
**Date:** 2026-04-24 | **Current Score:** 66/100 | **Target Score:** 82+/100

---

## Priority 1 — Immediate Blockers / Quick Wins (< 1 day)

### 1. Lazy-load PDF export bundle (Quick win — highest impact)
**Impact:** Cuts initial JS payload from ~1.08 MB to ~490 KB. Direct LCP improvement.  
**Effort:** Low (30 min)

In `src/components/DownloadButton.tsx`, change the top-level import to a dynamic import inside the handler:
```tsx
// Before (module-level — loads 594KB on every page)
import { ReportData, downloadPDF, downloadMarkdown } from '../utils/reportGenerator';

// After (dynamic — only loads when user clicks Download)
async function handle(type: 'pdf' | 'md') {
  setLoading(type);
  const { downloadPDF, downloadMarkdown } = await import('../utils/reportGenerator');
  if (type === 'pdf') downloadPDF(data);
  else downloadMarkdown(data);
  setLoading(null);
}
```

### 2. Add React.lazy route splitting to App.tsx (Quick win)
**Impact:** Reduces initial bundle — users only download code for the page they visit.  
**Effort:** Low (20 min)

```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('./pages/HomePage'));
const IncomeTaxSlabsPage = lazy(() => import('./pages/IncomeTaxSlabsPage'));
const NewVsOldRegimePage = lazy(() => import('./pages/NewVsOldRegimePage'));
const HRACalculatorPage = lazy(() => import('./pages/HRACalculatorPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
// Wrap <Routes> in <Suspense fallback={<div className="min-h-screen" />}>
```

### 3. Shorten homepage title (Quick win)
**Impact:** Better social share preview CTR; within 60-char recommended limit.  
**Effort:** Very low (5 min)

In `src/pages/HomePage.tsx`, change title prop from:
```
"Income Tax Calculator India FY 2026-27 | New vs Old Regime | Free Online Tool"
```
to:
```
"Income Tax Calculator India FY 2026-27 | New vs Old Regime"
```

### 4. Add Content-Security-Policy to vercel.json (Quick win)
**Impact:** Security header; trust signal for Google; protects against XSS.  
**Effort:** Low (15 min)

Add to the headers array in `vercel.json`:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * data:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'"
}
```

---

## Priority 2 — High-Impact Improvements (1–5 days)

### 5. Expand HRA Calculator page content
**Impact:** From 333 → 700+ words. Stronger ranking signal for "HRA calculator India" queries.  
**Effort:** Medium (2 hours)

Add below the calculator widget in `HRACalculatorPage.tsx`:
- How HRA exemption is calculated (the three-rule formula)
- Metro vs non-metro 50%/40% split with city list
- A worked numeric example (₹6L basic, ₹2.4L HRA, ₹1.8L rent paid)
- Common mistakes (rent receipt requirements, Section 10(13A))
- FAQ: "Can I claim HRA without rent receipts?", "What if I live in my own house?"

### 6. Remove or fix SearchAction schema
**Impact:** Removes a misleading schema that signals a non-existent site search.  
**Effort:** Very low (5 min)

In `src/index.html`, remove the `potentialAction` block from the WebSite schema:
```json
// Remove these lines from WebSite schema:
"potentialAction": {
  "@type": "SearchAction",
  "target": { ... },
  "query-input": "required name=search_term_string"
}
```
Only add it back if a real site search is implemented.

### 7. Add E-E-A-T signals to About page
**Impact:** Finance content requires high E-E-A-T. Reviewer credit increases trust.  
**Effort:** Low (1 hour)

- Add "Tax data verified against Income Tax Act 2025 — last reviewed April 2026" under disclaimer
- Add a "Get in Touch" section with a contact email or GitHub Issues link
- Update `AboutPage.tsx` Person schema: add `email` if available, expand `knowsAbout`

### 8. Expand Income Tax Slabs page
**Impact:** From 554 → 900+ words. "Income tax slab 2026-27" is a high-volume query.  
**Effort:** Medium (2 hours)

Add:
- Old Regime slabs table for all 3 age groups (Under 60, Senior, Super Senior)
- Surcharge table (10%/15%/25%/37% based on income)
- Health & Education cess explanation (4%)
- A worked example: ₹20L income → full tax calculation step-by-step
- "When does Old Regime beat New Regime?" summary table

---

## Priority 3 — Strategic Improvements (1–2 weeks)

### 9. Measure and optimize Core Web Vitals
**Impact:** Confirmed LCP/INP data needed. Actions 1–2 above should improve scores.  
**Effort:** Medium

Run PageSpeed Insights after deploying Actions 1–2:
```bash
python3 .claude/skills/seo/scripts/pagespeed.py https://itrplanner.in --strategy mobile
python3 .claude/skills/seo/scripts/pagespeed.py https://itrplanner.in --strategy desktop
```
Target: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile.

### 10. Auto-update WebApplication dateModified on deploy
**Impact:** Keeps schema fresh; signals active maintenance to Google.  
**Effort:** Low (30 min)

Add a prebuild script that updates `dateModified` in `index.html`:
```bash
# scripts/update-date.sh
TODAY=$(date +%Y-%m-%d)
sed -i '' "s/\"dateModified\": \"[0-9-]*\"/\"dateModified\": \"$TODAY\"/" index.html
```
Add `"prebuild": "bash scripts/update-date.sh"` to `package.json`.

### 11. Add twitter:site handle to SEOHead
**Impact:** Improves Twitter/X card attribution; minor trust signal.  
**Effort:** Very low (5 min)

In `src/components/SEOHead.tsx` add after twitter:image:
```tsx
<meta name="twitter:site" content="@yourtwitterhandle" />
```

### 12. Track GSC and CrUX data regularly
**Impact:** Evidence base for all future SEO decisions.  
**Effort:** Low (one-time setup)

- Verify itrplanner.in in Google Search Console (if not done)
- Monitor: Impressions, Clicks, Average Position for target queries
- Set up weekly GSC data export or Looker Studio dashboard

---

## Expected Score After Actions 1–8

| Category | Current | After P1+P2 | Change |
|----------|---------|-------------|--------|
| Technical SEO | 75 | 82 | +7 (CSP added) |
| Content Quality | 52 | 70 | +18 (HRA + About + Slabs expanded) |
| On-Page SEO | 61 | 72 | +11 (title shortened) |
| Schema | 78 | 85 | +7 (SearchAction fixed) |
| Performance (CWV) | 45 | 65+ | +20 (lazy PDF + routes) |
| Image Optimization | 70 | 70 | — |
| GEO | 95 | 95 | — |
| **Overall** | **66** | **80+** | **+14** |
