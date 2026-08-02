# 05 — Folio WASM Integration

## Source fork

`/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf` (Go HTML→PDF engine, wasm build target).

- Build: `make wasm` → outputs `cmd/wasm/.bin/folio.wasm` + `wasm_exec.js`
- **`folio.wasm` is currently missing from `.bin` — rebuild required** (toolchain verified: go1.26.3 linux/amd64, node v24.18.0)
- Built artifact is committed to the repo (pinned; document rebuild recipe in `scripts/build-wasm.md`)

## API

`globalThis.folioRender(html, settingsJSON) → Promise<{pdf: base64, pages, size, width, height, benchmark?}>` — async via syscall/js Promise.

`RenderSettings` (cmd/wasm/types.go):

| field | value |
|---|---|
| `pageSize` | `a4` \| `letter` \| `legal` \| `a3` (fallback only — **`@page` CSS overrides win**, see main.go:121-127) |
| `mediaType` | e.g. `print` (from media queries) |
| `pdfProfile` | `""` (default) |
| `pdfTitle` | metadata title |
| `ignoreResourceErrors` | bool |
| `cssDpi` | e.g. `96` |
| `watermark` | string |
| `headerHtml` / `footerHtml` | templates |
| `streamingThreshold` | batch/paging |
| `benchmark` | bool (spans) |
| `batchSize`, `maxWorkers`, `tmpDir`, `fresh`, `maxAttempts`, `notify`, `emptyItemPolicy`, `expectedPages`, `keepTmpFiles` | Node/batch-oriented |
| `fontBaseDir` | **Node-only — ignored in browser; fonts must be data-URI `@font-face`** |

## Hebrew handling (critical)

- PDF content stream needs **visual order**: pre-reverse Hebrew logical text before handing HTML to Folio (pattern proven in `examples/rtl/rtl.js`). No complex-script shaping in Hebrew — reversing is sufficient.
- Wrap rule: `<html dir="rtl" lang="he">` + `@page{size:A4 portrait;margin:0}` + `body{margin:0;padding:0}` + inline `<style>` (port of tziyun-berega `wrapExamHTML`).

## Dual-PDF page sizes

- Print: `@page{size:210mm 297mm}` (A4) or Letter — overrides `pageSize` fallback automatically.
- Share: **custom phone size** e.g. `@page{size:1080px 1920px}` — supported via `@page` override (main.go:121-127) with **zero Go changes**; `pageSize` stays `a4` as fallback. Also supports `AutoHeight` (height:0 = continuous page) if we want a scroll-style share sheet.

## Worker (browser path)

- `wasm_exec.js` (from Go toolchain) + `instantiateStreaming(folio.wasm)` + `go.run()` (blocks forever — standard) inside a dedicated Web Worker.
- **Do not use `folio-utils.js`** — it's Node-oriented (fs). Write a thin browser loader (~50 lines) in `features/folio/`.
- Font data-URI rewrite happens in the worker: fetch `/fonts/...` → base64 → replace `@font-face src`. Static fonts → persistent cache (Cache API / IndexedDB) so it's fetched once per app lifetime, not per render.
- One render at a time; warm instance; `terminate()` + respawn for cancel.

## Render flow

1. Capture page-div HTML + stylesheet (see 02-architecture render pipeline)
2. Worker: asset resolution → `folioRender(wrappedHtml, {pageSize:"a4", pdfTitle, pdfProfile:""})`
3. Result: `{pdf: base64, pages, size}` → Blob → download / print / Firebase Storage

## Phase 2 spike scope

1. `make wasm` → commit folio.wasm + wasm_exec.js
2. Minimal browser loader + worker: hello-world Hebrew render with data-URI font
3. Capture pipeline: off-screen mount → fonts.ready → capture → wrap → render on a 2-page sample sheet
4. **Word-decoration layout test through wasm** (big letter above each word, RTL, nikud) — highest-risk Folio feature
5. `page-break-before` multi-page verification + custom `@page` size (share) test
