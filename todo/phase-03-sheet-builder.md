# Phase 3 — Sheet Builder

Branch: `feat/sheet-builder` · Worktree: `.claude/worktrees/feat-sheet-builder` · Depends on: P1-02 (router), P2 (wasm pipeline), P4 data

## P3-01 Layout model (target-parameterized)
Status: done | Owner: agent-d | Started: 2026-08-03 | Deps: P1-02
Details: `SheetLayout` typed model: target (print/share/both), paper (a4|letter), page dims, base font scale (10.5–11pt print / 15–16pt share), margins (12–15mm print / ~10mm share), sections list, decoration scale. Single source for preview AND Folio HTML builder (no drift).
- [x] SheetLayout types + default builders per target

## P3-02 Sections implementation
Status: done | Owner: agent-d | Started: 2026-08-03 | Deps: P4 data (JSON committed), P3-01
Details: header (תפילות ולימוד לע"נ … ז"ל), blessing (אשר יצר אתכם בדין — optional <30 days), 7 fixed psalms (לג טז יז עב צא קד קל), אותיות השם + נשמה (Psalm 119 stanzas, 8 verses/letter, final ן/ף→נ/פ), קדיש יתום (nusach variants), משניות per letter, קדיש דרבנן + דאתחדתא, השכבה, closing prayers.
- [x] each section renders from data (letters resolved from name)

## P3-03 A4Page flow + pagination
Status: in-progress | Owner: agent-d | Started: 2026-08-03 | Deps: P3-02
Details: explicit 297×210mm page divs; flow content into pages; page-break-before:always between pages; page-level overflow handling (move block to next page).
- [x] multi-page sheet flows correctly for long names

## P3-04 SheetPreview + PreviewScaleWrapper
Status: in-progress | Owner: agent-d | Started: 2026-08-03 | Deps: P3-01
Details: mm-accurate scaled A4 preview (ExamPreview pattern); previews BOTH targets (A4 vs phone-format preview for share).
- [x] preview matches PDF output 1:1

## P3-05 Step 6 split editor + step 7 review
Status: in-progress | Owner: agent-d | Started: 2026-08-03 | Deps: P3-04, P1-02
Details: desktop = settings panel + live preview; mobile-first = accordion settings above preview + sticky bottom action bar; step 7 = review with actions (הדפסה/הורדה/שיתוף/שמירה wired to the render pipeline; firebase save can remain a stub marked TODO-for-phase-5); settings live-editable in step 6 (font, nikud, deco, acrostic, sections toggles); steps round-trip through URL query per WizardQuery.
- [x] step 6/7 UI complete (375px + desktop)

## P3-06 Word decoration (big letter above word)
Status: in-progress | Owner: agent-d | Started: 2026-08-03 | Deps: P2-04 findings, P3-02
Details: decorative large first-letter-above-word for psalms/headings (settings: deco on/off, scale). Consistent between preview and wasm render.
- [x] decorations render in preview + PDF
