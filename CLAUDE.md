# izkor

Hebrew memorial/prayer-sheet generator. Users fill out a wizard
(`web/src/features/wizard/`), the app builds a paginated sheet
(`web/src/features/sheet/`), and exports a PDF via **Folio**
(`go-html-to-pdf`), a WASM-compiled Go HTML→PDF renderer, invoked from
`web/src/features/render/renderSheetHTML.tsx`.

## Debugging PDF/Folio/WASM output

**Use the `debug-folio-pdf` skill** whenever a PDF looks wrong compared to
the browser preview (misalignment, wrong page count, off-center text,
spacing that doesn't match CSS), or before touching pagination/layout code
in either this repo or `go-html-to-pdf`. It documents the ground-truth-first
workflow (Node render harness, native Go layout harness, PyMuPDF exact
measurement, browser `getBoundingClientRect`/`getComputedStyle`) and a list
of known pitfalls (margin-collapse-through-overflow-hidden, `offsetTop`
never including margin, CSS logical-property RTL mapping, etc.) that have
each cost real debugging time before being pinned down. Load it before
guessing from a screenshot.

Two codebases can each independently own a "browser shows N pages, Folio
shows N+1" symptom: **Folio itself** (`go-html-to-pdf`, a sibling repo —
CSS/layout-engine correctness) and **this repo's own pagination JS**
(`web/src/features/sheet/pagination.ts` / `useSheetPagePlan.ts` — a
shelf-packing algorithm that *decides* page splits before Folio ever runs).
Verify which one actually owns a given bug before fixing anything — the
skill's checklist covers this.

Real engine-level fixes get an ADR in `go-html-to-pdf/docs/decisions/` (see
001-003 for the expected format: exact before/after numbers, root cause,
alternatives considered). Check there before re-diagnosing something that
might already be fixed and documented.

## Key paths

- `web/src/features/sheet/layout.ts` — single source of truth for page
  geometry (`SheetLayout`), shared by the live preview, the off-screen
  capture, and Folio's `@page` CSS.
- `web/src/features/sheet/useSheetPagePlan.ts` / `pagination.ts` — the
  shelf-packing pagination algorithm (measures rendered item heights,
  packs them into pages before Folio sees anything).
- `web/src/features/render/renderSheetHTML.tsx` — captures the
  already-paginated `<SheetDocument>` off-screen and hands it to Folio.
- `web/public/wasm/folio.wasm` — the built Folio binary this app loads.
  Rebuild via `make wasm GO=/usr/local/go/bin/go` in `go-html-to-pdf`, then
  copy `cmd/wasm/.bin/folio.wasm` here.
- `tests/render-yehudit.cjs` — Node harness that runs the real WASM build
  end-to-end (HTML → PDF), used for all "does this actually render
  correctly" verification. Never eyeball the live app for this.
