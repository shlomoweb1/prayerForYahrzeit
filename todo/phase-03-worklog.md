# Phase 3 worklog (agent-d)

Branch `feat/sheet-builder` · Worktree `.claude/worktrees/feat-sheet-builder`
Checkpoint protocol: append after EVERY commit. Resume from the last entry.

## 2026-08-03 09:30 - P3-01/P3-02 status - resumed session, housekeeping
- Verified P3-01 + P3-02 commits intact (layout model, fonts registry, typed data
  accessors), typecheck green; marked both tasks done in todo/phase-03-sheet-builder.md.
- Found latent issue: `web/src/lib/*.ts` import `../../data/*.json` which resolves to
  `web/data/` - that dir does not exist (data lives at repo root `data/`). Build only
  passed because nothing imports those modules yet. Fixed to `../../../data/*.json`
  (3 levels up = repo root) + comment in data-modules.d.ts.
- Created this worklog.
- Next: P3-03 - sheet content model + pagination core (pure logic + unit tests).

## 2026-08-03 09:45 - P3-03 status - content model + pagination logic
- Committed `1086d91`: todo statuses P3-01/P3-02 done, data import paths fixed
  (`../../data` → `../../../data`, repo-root `data/`; previously latent - would
  break the first real import; typecheck + build green).
- Restarted the vite dev server from the worktree (old pid 285784 was serving the
  main repo, not the worktree; new pid 348244 on :5199).
- Next: web/src/features/sheet/content.ts + pagination.ts (+ unit tests).

## 2026-08-03 09:55 - P3-03 status - content model + packing committed
- `web/src/features/sheet/content.ts`: 10-section content model (header, blessing,
  psalms, letters name/parent/neshama, kaddish yatom + derabanan, mishnayot,
  hashkava, closing) honoring settings (sections toggles, acrostic mode, blessing,
  nikud); `buildPageItems` flattens to pagination granularity (per-verse psalm
  bodies, splitBlocks prayer chunks, keepWithNext headings).
- `web/src/features/sheet/pagination.ts`: pure sequential first-fit packing with
  keep-with-next heading rule; `pagination.test.ts` + `content.test.ts` (56 tests
  green, lint clean, typecheck green).
- Next: measurement-driven page rendering - sheet CSS string, SheetDocument
  (measure → pack → render pages), PreviewScaleWrapper + SheetPreview (P3-03/04).


## 10:05 - P3-03 renderer + P3-04 preview + P3-06 deco committed (10c4d5b)
- SheetDocument (sheet-document.tsx): hidden measure stack at content width (data-item-id) → cumulative bottom offsets give exact stacked heights incl. margin collapse → paginate → page divs (izkor-page, pageBreakBefore always, data-izkor-content wrapper) → convergence pass (max 5): page overflow ⇒ bump first-item height via fixesRef and re-pack.
- SheetPreview + PreviewScaleWrapper (SheetPreview.tsx, PreviewScaleWrapper.tsx): scale-to-fit via ResizeObserver; onMeasure from SheetDocument reports full stacked height so the wrapper fits ALL pages (fixed flaw where only one page height was used).
- WordDecoLine (WordDecoLine.tsx): flex-row of flex-columns per spike FINDINGS P2-04; splitFirstCluster; used for header/psalm-title/verses. BUG FOUND + fixed by smoke test: array-rendered word spans concatenated without spaces (textContent "תפילותולימוד…"); now pushes ' ' between word columns.
- sheet-css.ts: static structural rules (.izkor-page/.izkor-dline/.izkor-dword/.izkor-ddeco/…); layout numbers stay inline on elements; SHEET_STYLE_ATTR export (style tag data-izkor-sheet for capture pipeline).
- 4 new smoke tests (sheet-document.test.tsx): header text, all item kinds render, deco off path, stylesheet injection. 60/60 pass; typecheck/lint(0 err, 9 pre-existing warnings)/build green.
- Todo: P3-03 done; P3-04/05/06 in-progress (checkboxes updated).

## 10:30 - P3-05 step 6 + step 7 committed
- WizardQuery: added `blessing` field (0/1, default 0).
- from-query.ts: sheetSettingsFromQuery / sheetLayoutFromQuery / useSheetDraft - single bridge from URL query to SheetSettings+SheetLayout; font validated against SHEET_FONTS keys; share target → 1080×1920 layout.
- SheetSettingsPanel.tsx: font select (6 families), paper select, nikud/deco/blessing switches, acrostic radio, 6 section checkboxes; accordion on <lg, static panel on ≥lg (duplicated controls instance via useId).
- step-6-split.tsx: settings + live SheetPreview; sticky bottom action bar with next→step 7.
- step-7-review.tsx: scaled preview + natural-size off-screen print copy (.izkor-print-area, left:-200vw) + @page override from layout + visibility media rules; actions: הדפסה (window.print), הורדה/שיתוף/שמירה disabled stubs w/ TODO-for-phase-5 note.
- i18n: wizard.labels.settings + wizard.labels.blessing + wizard.sections.* + wizard.actions.* added to en/he/es/fr.
- Browser-verified (dev server 5199): step 6 renders 23 A4 pages 794×1123, no page overflow (max content 1023 ≤ 1025), deco on/off + nikud toggles round-trip through URL and re-render live; step 7 print area off-screen, buttons present; 375px mobile: accordion + sticky bar + scaled preview. 60 tests pass, typecheck/lint/build green.

## 11:20 - PDF pipeline proof: fonts embedded, 20 A4 pages (P3-06 done, P3-05 download wired)
- Render pipeline in worktree: render/renderSheetHTML.tsx (off-screen capture host at layout width → style[data-izkor-sheet] cssRules serialized → .izkor-page outerHTMLs → standalone RTL doc with @page; fonts.ready → reflow → 3×16ms frames), folio/font-embedder.ts (session-cached url→data URI, worker-side inlineFontFaces), folio/folio.worker.ts (IIFE classic ?worker + importScripts('/wasm/wasm_exec.js'), Go warm, single in-flight), folio/folio-client.ts (spawn/warm/render/cancel singleton, DEV-only __folioClient hook).
- web/public/wasm/ was missing in the worktree → Vite SPA fallback served index.html for /wasm/* (fetch 200 but `Unexpected token '<'` from Go instantiate); copied folio.wasm + wasm_exec.js from the main repo (untracked, not ignored).
- step-7 download wired: base64ToBytes → Blob → anchor yizkor-<name>.pdf; busy label wizard.actions.downloading; error alert wizard.errors.render.
- ROOT CAUSES of the Helvetica-only PDF (46KB, 2362 ???? glyphs): (1) font-family/font-size/line-height lived only on the .izkor-sheet wrapper - capture drops ancestors ⇒ no text matched the fonts ⇒ Folio fell back to Helvetica (also explains preview 23 pages vs PDF 20); fixed by putting the three props on .izkor-page inline style. (2) Folio's CSS parser rejects font-display descriptor AND family names with spaces (CSSOM serializes them unquoted); fixed by stripping font-display + format() hints in captureSheetStyles and compactFontFamily() renaming family to space-free form at capture time (spike's working @font-face has neither - FINDINGS P2-03).
- Verified via CDP + __folioClient A/B tests (data-URI vs path src; minimal spike-format doc embeds fonts, spaced family/font-display variants don't): final PDF 200,967 bytes, A4 595.276×841.89, 20 pages = .izkor-print-area page count, pdffonts shows embedded subset NotoSerifHebrew Regular+Bold (Identity-H), 0 ???? glyphs, Hebrew + nikud extract correctly, deco letters positioned above their words, RTL order intact.
- TODO-for-phase-5: pdfinfo title shows mojibake (UTF-8 bytes read as Latin-1) - cosmetic, deferred.
- Todo: P3-06 done. Next: commit this (render pipeline + page style fix + i18n/step7 wiring + wasm assets), then final phase-3 report.
