# Phase 3 — Sheet Builder

Branch: `feat/sheet-builder` · Worktree: `.claude/worktrees/feat-sheet-builder` · Depends on: P1-02 (router), P2 (wasm pipeline), P4 data

## P3-01 Layout model (target-parameterized)
Status: pending | Owner: — | Started: — | Deps: P1-02
Details: `SheetLayout` typed model: target (print/share/both), paper (a4|letter), page dims, base font scale (10.5–11pt print / 15–16pt share), margins (12–15mm print / ~10mm share), sections list, decoration scale. Single source for preview AND Folio HTML builder (no drift).
- [ ] SheetLayout types + default builders per target

## P3-02 Sections implementation
Status: pending | Owner: — | Started: — | Deps: P4 data (JSON committed), P3-01
Details: header (תפילות ולימוד לע"נ … ז"ל), blessing (אשר יצר אתכם בדין — optional <30 days), 7 fixed psalms (לג טז יז עב צא קד קל), אותיות השם + נשמה (Psalm 119 stanzas, 8 verses/letter, final ן/ף→נ/פ), קדיש יתום (nusach variants), משניות per letter, קדיש דרבנן + דאתחדתא, השכבה, closing prayers.
- [ ] each section renders from data (letters resolved from name)

## P3-03 A4Page flow + pagination
Status: pending | Owner: — | Started: — | Deps: P3-02
Details: explicit 297×210mm page divs; flow content into pages; page-break-before:always between pages; page-level overflow handling (move block to next page).
- [ ] multi-page sheet flows correctly for long names

## P3-04 SheetPreview + PreviewScaleWrapper
Status: pending | Owner: — | Started: — | Deps: P3-01
Details: mm-accurate scaled A4 preview (ExamPreview pattern); previews BOTH targets (A4 vs phone-format preview for share).
- [ ] preview matches PDF output 1:1

## P3-05 Step 6 split editor + step 7 review
Status: pending | Owner: — | Started: — | Deps: P3-04, P1-02
Details: desktop = settings panel + live preview; mobile-first = accordion settings above preview + sticky bottom action bar; step 7 = review actions (הדפסה/הורדה/שיתוף/שמירה), settings live-editable.
- [ ] step 6/7 UI complete (375px + desktop)

## P3-06 Word decoration (big letter above word)
Status: pending | Owner: — | Started: — | Deps: P2-04 findings, P3-02
Details: decorative large first-letter-above-word for psalms/headings (settings: deco on/off, scale). Consistent between preview and wasm render.
- [ ] decorations render in preview + PDF
