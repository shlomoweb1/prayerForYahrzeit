# 02 — Architecture

## Stack

- Vite + React 19 + TypeScript (strict)
- TanStack Router (file-based) — all wizard state in URL query via `validateSearch` + zod
- TanStack Query — data fetching/caching
- Tailwind CSS v4 (CSS-first config, `@theme`, logical utilities) + shadcn/ui components cloned into `web/src/components/ui/`
- lucide-react icons
- zod (URL schema, settings schema)
- react-i18next — locales: `he` (default), `en`, `es`, `fr`
- vitest + Testing Library (unit), Playwright (E2E/snapshots)
- PWA (workbox/vite-plugin-pwa)
- Firebase CLI + web SDKs

## Repo layout

```
izkor/
├── plans/  todo/            # docs + tracking (this repo)
├── web/                     # Vite app
│   └── src/
│       ├── routes/          # TanStack Router (/, /wizard, /accessibility)
│       ├── features/
│       │   ├── wizard/      # steps, step registry, URL schema
│       │   ├── sheet/       # layout model, SheetPreview, sections, A4Page
│       │   ├── render/      # capture, wrapHTML, asset resolver
│       │   ├── folio/       # wasm worker, loader, types
│       │   ├── i18n/        # locales, dictionaries
│       │   ├── a11y/        # Reg-35 widget, preferences store
│       │   └── firebase/    # firestore/storage/auth/analytics wrappers
│       ├── components/ui/   # cloned shadcn (logical-props fixed)
│       └── lib/             # tehillim, fonts, liturgy data access
├── data/                    # generated: tehillim.json, liturgy.json
├── scripts/                 # data build, itim harvest, font tooling
├── firebase/                # firebase.json, rules, index, functions (if any)
└── docs/
```

## URL-state wizard

- Single zod schema `WizardQuery` wired to Router `validateSearch`:

```ts
?step=1..7&target=print|share|both&paper=a4|letter
&gender=male|female&nusach=ashkenaz|sefard
&name=<hebrew>&parent=<hebrew>
&font=noto-serif&nikud=1&deco=1&acrostic=both
&sections=psalms,neshama,kaddish,mishnayot,hashkava,closing
&dialog=share
```

- Modals = `dialog=` param; closing/back just removes the param.
- A11y preferences are **not** in the URL (device preference, not sheet content) — localStorage, versioned key.
- Wizard = 7 steps, one question/screen: 1) target (print / share / both) + paper size when print, 2) gender (בן/בת), 3) nusach (אשכנז/ספרד), 4) name (live letter preview), 5) parent name, 6) **split editor**, 7) review → הדפסה/הורדה/שיתוף/שמירה.

## Step 6 — split editor (ExamPreview pattern)

- Desktop: settings panel + **mm-accurate scaled A4 preview** (`SheetPreview` + `PreviewScaleWrapper` scale-to-fit).
- Mobile-first: accordion settings groups above preview + sticky bottom action bar.
- **One shared layout model** (page dims, font scale, sections, decorations) feeds both the preview AND the Folio HTML builder → preview/PDF can never drift.

## Render pipeline (main thread capture → worker wasm)

1. `features/render/renderSheetHTML.ts` — mount `SheetPreview` off-screen (`position:fixed; left:-9999px; width:794px` — A4@96dpi); wait `document.fonts.ready` → forced reflow → 3-frame wait (16ms timer shim for background tabs); read `innerHTML` of explicit 297×210mm page divs; capture stylesheet (`document.styleSheets → cssRules → cssText`); assemble wrapped document (`wrapExamHTML` port: `@page{size:…;margin:0}` + inline `<style>` + `dir="rtl" lang="he"`).
2. `features/folio/folio.worker.ts` — lazy init: `wasm_exec.js` + `instantiateStreaming(folio.wasm)` + `go.run()`; rewrites `@font-face src` → data URIs (worker fetches TTFs; static fonts cached persistently — Cache API/IndexedDB — fetched once); calls `folioRender(html, settings)`; posts `{pdf base64, pages, size}` back.
3. Main thread: base64 → Blob → download / `window.print()` / Firebase Storage upload for share.

Message protocol:

```
main → worker:  {type:"render", id, html, settings}
worker → main:  {type:"ack", id} | {type:"progress", id, phase:"fonts"|"render"}
                | {type:"result", id, pdf, pages, size} | {type:"error", id, message}
```

- One render at a time (main-thread queue); cancel = `terminate()` + respawn; warm instance between renders.
- **No OMR/positions** (unlike tziyun-berega): pure HTML capture — no layout merge step.

## Mobile-first & RTL mandates

- Build order: base (375px) → sm → md → lg → xl.
- Tailwind v4 rem-based spacing; **no hard px** in components (a11y 100–150% text scaling).
- shadcn clones must convert physical→logical: `pl/pr/ml/mr → ps/pe/ms/me`, `left/right → start/end`, `text-left/right → text-start/end`, `border/rounded -l/-r → -s/-e`, `inset-x → inset-inline`.
- Enforced via an eslint rule that fails CI (see `06-accessibility.md`).

## Source material (read-only references)

- Folio fork: `/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf`
- ExamPreview pattern: `/home/shlomo-framowitz/Developments/tziyun-berega/software/.claude/skills/exam-preview-a4/SKILL.md`
- Worker internals: `tziyun-berega/software/frontend/src/worker-main.tsx`, `utils/renderExamCopyToHTML.tsx`, `components/exams/ExamPreview/*`, `backend/handlers/pdf/generate.go` (patterns only)
