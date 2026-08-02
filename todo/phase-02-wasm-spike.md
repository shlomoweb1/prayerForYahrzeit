# Phase 2 — Folio WASM Spike

Branch: `feat/folio-spike` · Worktree: `.claude/worktrees/feat-folio-spike` · Depends on: docs (committed)

Source fork: `/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf` · Reference patterns: `examples/rtl/rtl.js`, `software/frontend/src/worker-main.tsx`, `utils/renderExamCopyToHTML.tsx`, `backend/handlers/pdf/generate.go`

## P2-01 Rebuild folio.wasm artifact
Status: pending | Owner: — | Started: — | Deps: —
Details: `make wasm` in fork; commit `cmd/wasm/.bin/folio.wasm` + `wasm_exec.js` into repo; write `scripts/build-wasm.md` (recipe, Go version, checksum).
- [ ] make wasm succeeds
- [ ] artifact committed + recipe doc

## P2-02 Browser wasm loader + worker
Status: pending | Owner: — | Started: — | Deps: P2-01
Details: `features/folio/` — thin browser loader (~50 lines, NOT folio-utils.js which is Node-only): wasm_exec.js + instantiateStreaming + go.run() in a Web Worker; message protocol (render/ack/progress/result/error); warm instance; terminate+respawn for cancel.
- [ ] worker boots wasm, hello-world render returns base64 PDF
- [ ] message protocol implemented

## P2-03 Capture pipeline
Status: pending | Owner: — | Started: — | Deps: P2-02
Details: off-screen mount (position:fixed; left:-9999px; width:794px) → document.fonts.ready → forced reflow → 3-frame wait (16ms shim) → innerHTML of page divs + stylesheet capture (cssRules→cssText) → wrapExamHTML port (@page size/margin:0, inline <style>, dir=rtl lang=he).
- [ ] 2-page sample sheet HTML → PDF in browser (page count correct)

## P2-04 Decorated-word render test (highest risk)
Status: pending | Owner: — | Started: — | Deps: P2-02
Details: big letter above each word (RTL, nikud) rendered through folioRender; compare visual fidelity vs screen preview; document any Folio quirks/limits.
- [ ] decorated block renders correctly (PDF bytes inspected)
- [ ] findings noted in plans/05 or spike report

## P2-05 Multi-page + custom page size
Status: pending | Owner: — | Started: — | Deps: P2-02
Details: `page-break-before:always` multi-page flow; custom `@page{size:1080px 1920px}` (share target) — verify @page overrides pageSize fallback (main.go:121-127).
- [ ] explicit page breaks honored (N pages = N divs)
- [ ] custom phone size renders
