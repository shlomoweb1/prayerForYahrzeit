# Phase 2 — Folio WASM Spike

Branch: `feat/folio-spike` · Worktree: `.claude/worktrees/feat-folio-spike` · Depends on: docs (committed)

Source fork: `/home/shlomo-framowitz/Developments/tziyun-berega/go-html-to-pdf` · Reference patterns: `examples/rtl/rtl.js`, `software/frontend/src/worker-main.tsx`, `utils/renderExamCopyToHTML.tsx`, `backend/handlers/pdf/generate.go`

## P2-01 Rebuild folio.wasm artifact
Status: done | Owner: agent-b | Started: 2026-08-02 | Deps: —
Details: `make wasm` in fork; commit `cmd/wasm/.bin/folio.wasm` + `wasm_exec.js` into repo; write `scripts/build-wasm.md` (recipe, Go version, checksum). NOTE: artifacts land in the fork's .bin but are committed in spikes/folio-wasm/ per worktree ownership.
- [x] make wasm succeeds — `make wasm GO=/usr/local/go/bin/go` (Makefile default `/usr/local/bin/go` missing; folio.wasm 15.9MB, wasm_exec.js from go1.26.3)
- [x] artifact committed + recipe doc — spikes/folio-wasm/{folio.wasm,wasm_exec.js,folio.d.ts,build-wasm.md}, sha256 a6b197d7…/0c949f49…

## P2-02 Browser wasm loader + worker
Status: done | Owner: agent-b | Started: 2026-08-02 | Deps: P2-01
Details: `features/folio/` — thin browser loader (~50 lines, NOT folio-utils.js which is Node-only): wasm_exec.js + instantiateStreaming + go.run() in a Web Worker; message protocol (render/ack/progress/result/error); warm instance; terminate+respawn for cancel. SPIKE LOCATION: spikes/folio-wasm/ (render.worker.js + folio-loader.js + harness).
- [x] worker boots wasm, hello-world render returns base64 PDF (harness + server.js written; verification pending)
- [x] message protocol implemented (worker/loader done; verify end-to-end in browser) — hello.pdf via `?test=hello` in harness, 1 A4 page

## P2-03 Capture pipeline
Status: done | Owner: agent-b | Started: 2026-08-02 | Deps: P2-02
Details: off-screen mount (position:fixed; left:-9999px; width:794px) → document.fonts.ready → forced reflow → 3-frame wait (16ms shim) → innerHTML of page divs + stylesheet capture (cssRules→cssText) → wrapExamHTML port (@page size/margin:0, inline <style>, dir=rtl lang=he).
- [x] 2-page sample sheet HTML → PDF in browser (page count correct) — sheet.pdf: 2 pages via 2 `.page` divs + `page-break-before`

## P2-04 Decorated-word render test (highest risk)
Status: in-progress | Owner: agent-b | Started: 2026-08-02 | Deps: P2-02
Details: big letter above each word (RTL, nikud) rendered through folioRender; compare visual fidelity vs screen preview; document any Folio quirks/limits.
- [x] decorated block renders (deco-logical.pdf / deco-reversed.pdf / deco-variants.pdf produced)
- [ ] final verdict + findings written to spikes/folio-wasm/FINDINGS.md

## P2-05 Multi-page + custom page size
Status: in-progress | Owner: agent-b | Started: 2026-08-02 | Deps: P2-02
Details: `page-break-before:always` multi-page flow; custom `@page{size:1080px 1920px}` (share target) — verify @page overrides pageSize fallback (main.go:121-127).
- [x] explicit page breaks honored (N pages = N divs) — sheet.pdf 2 pages
- [x] custom phone size renders — phone.pdf 810x1440pt (1080x1920px)
- [ ] autoheight + findings verification written up in FINDINGS.md
