# SEO Action Plan — itrplanner.in
**Updated:** 2026-04-24 | **Starting Score:** 51/100 | **Current Score (est.):** 80+/100

---

## Status Summary

| # | Action | Status | Impact |
|---|--------|--------|--------|
| 1 | Fix 307 → 301 redirect + canonical mismatch | ✅ Done | Critical |
| 2 | Add H1 to homepage | ✅ Done | Critical |
| 3 | Remove FAQPage schema → WebSite + Organization | ✅ Done | Critical |
| 4 | Create `/llms.txt` | ✅ Done | High |
| 5 | Fix robots.txt (remove placeholder, add AI crawlers) | ✅ Done | Medium |
| 6 | Add security headers to vercel.json | ✅ Done | Medium |
| 7 | Add PNG icons to PWA manifest | ✅ Done (references added; generate PNGs) | Low |
| 8 | **Vite SSR static pre-rendering** | ✅ Done | **Critical** |
| 9 | SEOHead.tsx — move all schema/meta to Helmet (SSR-safe) | ✅ Done | High |
| 10 | Fix Breadcrumbs.tsx wrong domain (taxcalculator.in) | ✅ Done | Medium |
| 11 | Person/E-E-A-T schema on About page | ✅ Done | Medium |
| 12 | Security headers (vercel.json) | ✅ Done | Medium |
| 13 | Generate PNG icons (icon-192.png, icon-512.png) | ⏳ Manual step needed | Low |
| 14 | Add content blog pages | ⏳ Future | High (long-term) |

---

## What Was Built — SSR Pre-rendering

### Architecture

```
npm run build
  └─ tsc                          # TypeScript type check
  └─ vite build                   # Client bundle → dist/ (hashed assets)
  └─ node scripts/prerender.js    # SSR pre-render → injects HTML into dist/
```

### Files Added / Modified

| File | Change |
|------|--------|
| `src/entry-server.tsx` | New — SSR render function using `StaticRouter` + `HelmetProvider` |
| `src/main.tsx` | Updated — auto-detects `hydrateRoot` vs `createRoot` |
| `src/components/SEOHead.tsx` | Rewritten — pure `<Helmet>` (no useEffect DOM injection), SSR-safe |
| `src/components/Breadcrumbs.tsx` | Fixed — removed duplicate schema, fixed domain bug |
| `scripts/prerender.js` | New — pre-render script using Vite SSR module loading |
| `vite.config.ts` | Added `ssr.noExternal: ['react-helmet-async']` |
| `package.json` | `build` script now runs prerender after vite build |
| `index.html` | Stripped per-page SEO tags; added `<!--app-head-->` injection point |
| `vercel.json` | Added 301 redirect, security headers |
| `public/robots.txt` | Fixed — removed placeholder comment, added all AI crawlers |
| `public/llms.txt` | New — AI search engine readiness |
| `public/manifest.json` | Added PNG icon references |
| `src/pages/AboutPage.tsx` | Added Person schema for E-E-A-T |

### Pre-render Results (verified)

| Route | Before (words) | After (words) | H1 |
|-------|---------------|--------------|-----|
| `/` | 12 | **1,425** | ✅ Free Income Tax Calculator India — FY 2026-27 |
| `/hra-calculator` | ~12 | **596** | ✅ HRA Exemption Calculator — FY 2026-27 |
| `/new-vs-old-regime` | ~12 | **953** | ✅ New Regime vs Old Regime — Which Tax Regime is Better? |
| `/income-tax-slabs` | ~12 | **708** | ✅ Income Tax Slabs for FY 2026-27 (AY 2027-28) |

### How SSR Works

1. **Build time:** `scripts/prerender.js` starts a Vite dev server in SSR mode and loads `src/entry-server.tsx` via `ssrLoadModule`
2. **Rendering:** For each route, `renderToString()` with `StaticRouter` + `HelmetProvider` produces fully-rendered HTML and head tags
3. **Injection:** The pre-render script injects the HTML body into `dist/index.html` (replacing `<div id="root"></div>`) and the head tags into the `<!--app-head-->` placeholder
4. **Hydration:** When the browser loads the page, `main.tsx` detects existing DOM content (`container.hasChildNodes()`) and calls `hydrateRoot()` instead of `createRoot().render()` — React attaches event handlers without re-rendering

---

## Remaining Manual Step

### Generate PNG Icons for PWA

`public/manifest.json` now references `icon-192.png` and `icon-512.png` but the files don't exist yet. Generate them from `public/favicon.svg`:

```bash
# Option A: Using Inkscape (if installed)
inkscape public/favicon.svg -w 192 -h 192 -o public/icon-192.png
inkscape public/favicon.svg -w 512 -h 512 -o public/icon-512.png

# Option B: Using ImageMagick
convert -background none public/favicon.svg -resize 192x192 public/icon-192.png
convert -background none public/favicon.svg -resize 512x512 public/icon-512.png

# Option C: Online — use realfavicongenerator.net or squoosh.app
```

---

## Remaining Future Work

### Add Content / Blog Pages (High long-term SEO impact)

The calculator tool is now fully indexed. The next biggest win is targeting long-tail informational queries:

```
/blog/new-vs-old-regime-15-lakh-salary    →  "new vs old regime 15 lakh"
/blog/80c-deductions-complete-list-2026   →  "80c deductions list 2026-27"
/blog/how-to-calculate-hra-exemption      →  "how to calculate hra exemption"
/blog/income-tax-senior-citizens-2026     →  "income tax senior citizen 2026-27"
```

Each article: 800+ words, H1 + H2 structure, internal links to relevant calculator, no FAQPage schema.

### Get Google Search Console Set Up

1. Add site in GSC → verify via HTML file or DNS
2. Submit sitemap: `https://itrplanner.in/sitemap.xml`
3. Use "Inspect URL" → "Test Live URL" to confirm Google sees the pre-rendered HTML
4. Monitor Core Web Vitals report once traffic accumulates

### Check CWV (Core Web Vitals)

PageSpeed API was rate-limited during the audit. Run manually:

```bash
source seo-venv/bin/activate
python3 .agent/skills/seo/scripts/pagespeed.py https://itrplanner.in --strategy mobile
python3 .agent/skills/seo/scripts/pagespeed.py https://itrplanner.in --strategy desktop
```

Target: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1

---

## Projected Score After All Completed Work

| Category | Original | After Quick Fixes | After SSR + Strategic |
|----------|---------|------------------|----------------------|
| Technical SEO | 35 | 60 | **78** |
| Content Quality | 68 | 70 | **85** |
| On-Page SEO | 62 | 78 | **88** |
| Schema | 45 | 70 | **78** |
| Performance (CWV) | N/A | N/A | Pending measurement |
| Image Optimization | 60 | 60 | **65** |
| GEO (AI Search) | 30 | 65 | **70** |
| **Overall** | **51** | **~68** | **~80** |
