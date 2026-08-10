# 10 - SEO & GEO

Status: **approved**

Goal: make the CSR-only Vite SPA properly indexable and shareable - per-route metadata, JSON-LD, per-locale URLs, prerendering, sitemap/robots/llms.txt, and two missing pages (`/contact`, `/privacy`).

Skill: `react-seo-skills` (install via `npx react-seo-skills` from repo root; markdown-only, MIT). Reference files: `skill/references/react-vite.md`, `structured-data.md`, `geo.md`, `validation.md`.

## Stack facts (verified)

- Vite 8 + React 19 + TanStack Router 1.170.18, CSR-only, Firebase static hosting (`cleanUrls`, SPA rewrite `**` → `/index.html`).
- Blog: `web/src/content/blog/*.md` (he/en, `?raw` imports), `web/src/features/blog/posts.ts` (frontmatter: title/date/excerpt), i18n: he/en/es/fr (blog content authored he/en only; es/fr fall back to en).
- `autoCodeSplitting: true` (tsr.config.json + vite.config.ts) - route components are lazy chunks.
- No head management anywhere: no per-route meta, no OG, no canonical, no JSON-LD, no robots.txt/sitemap.xml/llms.txt. `index.html` has static he title/description only.
- Contact exists only as modal on About (`ContactForm.tsx`, FormSubmit placeholder `REPLACE_ME`). No `/contact` route, no privacy page.

## Locked decisions

1. **Domain**: `.env` + `.env.sample` (absorb `.env.example`, then delete it) with `VITE_SITE_URL`; Vite replaces at build. Fallback + TODO if unset.
2. **Locales**: per-locale URLs, Hebrew default. Bare URLs = Hebrew (`/`, `/blog/x`, `/about`, `/contact`, `/privacy`) + `x-default`. Other locales prefixed (`/en/blog/x`, …). Browser auto-detect on first visit (no stored pref + `navigator.language` supported → redirect to prefixed path), manual switch via upgraded LocalePicker (sibling-path links). `useRouteLocale()` drives i18n/content, not global state. `/wizard` stays locale-neutral.
3. **Head mechanism**: TanStack Router native head API - `head()` per route + `<HeadContent />` portaled into `document.head`. No `react-helmet-async`.
4. **OG image**: crop `web/public/images/Yorzait-candle-sunset.png` (1536×1024) → 1200×630 → `web/public/images/og-cover.jpg` (~200 KB).
5. **GEO**: yes - `llms.txt` + explicit AI crawler rules. No `/ai` page.
6. **JSON-LD escaping**: always `JSON.stringify(x).replace(/</g, '\\u003c')`.
7. **Author**: שלמה (from About bio) for BlogPosting.

## Phases

### 1. Env + SEO infra
- `.env.sample`/`.env` (`VITE_SITE_URL`), `web/src/lib/site.ts` (reads `import.meta.env.VITE_SITE_URL`).
- `web/src/features/seo/`: `escapeJsonLd`, `buildArticleSchema`, `buildBreadcrumbs`, `SiteDefaults` head, HeadContent portal.
- Per-route `head()`: home (`WebSite`+`Organization`), `/about` (`Person`), `/accessibility` (`WebPage`).
- `index.html`: canonical + OG/Twitter fallbacks. `noindex` on `/wizard` + 404.

### 2. Per-locale routing
- New `/en` route subtree (about, accessibility, blog/index, blog/$slug, index) reusing existing localized components.
- First-visit auto-detect redirect (localStorage `izkor:locale:v1`), LocalePicker → sibling links + persist.
- `useRouteLocale()` + i18n `changeLanguage` per route; `useLocalizedContent`/`useLocalizedPost` URL-driven.
- hreflang alternates in every content route head (he/en; es/fr link en).

### 3. Blog SEO
- Split `posts.ts` → `posts-meta.ts` (frontmatter-only, eagerly importable) + bodies stay lazy - **required** so `head()` imports don't defeat `autoCodeSplitting`.
- `/blog` head: `BreadcrumbList`. `/blog/$slug`: `BlogPosting` (headline, excerpt, datePublished/dateModified, author, publisher Org+logo, mainEntityOfPage, absolute URLs).

### 4. Contact + Privacy pages
- `/contact`: route + page reusing `ContactForm` (keep About modal as-is), i18n ×4, nav/footer links.
- `/privacy`: route + page, markdown he/en (es/fr fallback). Copy from real data story: FormSubmit third-party, localStorage prefs, PWA/workbox caching, WASM PDF in-browser, no tracking/analytics. User approves legal wording.
- Both: per-locale URLs, hreflang, sitemap, prerender, JSON-LD (ContactPage/Organization contactPoint; WebPage), footer links.
- TODOs (not this scope): ContactForm `REPLACE_ME` endpoint, accessibility placeholder email.

### 5. Crawlability + GEO + prerender
- `public/robots.txt`: allow all + GPTBot/ClaudeBot/PerplexityBot/Google-Extended/Applebot-Extended + Sitemap.
- `scripts/generate-sitemap.mjs` → `public/sitemap.xml` (all locale URLs, lastmod from post dates) wired into `npm run build`.
- `public/llms.txt`.
- `scripts/prerender.mjs`: Playwright crawl over `vite preview` → static `dist/<path>/index.html` per route; per-route wait `networkidle` + stable condition (h1/JSON-LD present) - lazy chunks load after navigation. Optional `404.html` via Firebase `errorPage`.

### 6. Verification
- `curl` prerendered HTML: per-route title/OG/JSON-LD; JSON-LD parses with absolute URLs.
- Playwright e2e meta assertions; `npm run audit:lighthouse`; html-validate on prerendered output.
- Confirm in built bundle: `head` eager, components lazy.

## Sequencing

Run on current HEAD (`aaf8bc5`, tree clean). Phases 1–2 → 3 → 4 → 5 → 6. `routeTree.gen.ts` is generated - regenerate after route changes, never hand-edit.
