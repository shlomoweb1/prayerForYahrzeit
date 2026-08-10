# Folio WASM spike - findings (Phase 2)

Date: 2026-08-03 · Branch: `feat/folio-spike` · Evidence: `spikes/folio-wasm/out/*.pdf`

How verified: `pdftotext -bbox` + raw content-stream inspection (`mutool clean -d` + `mutool show`)
and `pdftohtml -xml`, cross-checked against the on-screen Chrome reference measured with
`getBoundingClientRect` in the harness preview. PNGs in `out/` are pdftoppm renders
(gitignored; regenerate with `pdftoppm -png -r 96 <name>.pdf <name>`).

## Verdicts

| Test | Result |
|---|---|
| P2-02 hello render through wasm worker | WORKS - hello.pdf, 1× A4, 595.28×841.89 pt |
| P2-03 capture pipeline (off-screen mount → wrap → render) | WORKS - sheet.pdf = 2 pages, one per `.page` div |
| P2-04 decorated words | PARTIAL - see below; flex pattern works, inline-block pattern breaks |
| P2-05 multi-page + custom size + autoheight | WORKS - 810×1440 pt phone page, continuous autoheight page |

## P2-04 decorated-word test (highest risk)

Test content: `אַבְרָהָם בֶּן יִצְחָק` + 7-word prayer line, each word wrapped as
`<span class="word"><span class="deco">big letter</span>rest</span>`, target look = big
letter above each word, words inline RTL, nikud intact.

### What the evidence shows

- **Plain RTL paragraphs are PERFECT in Folio**: word order correct (first word rightmost,
  verified by bbox x-coords), nikud marks present, marks anchored ~3-4 pt left of their
  consonant (normal RTL mark positioning), font sizes match CSS exactly (measured 37.05 pt
  for 49.4px deco, 19.5 pt for 26px body).
- **`display:inline-block` + block deco child BREAKS**: each `.word` is laid out as a
  full-width block (words stack vertically, ~72 pt apart instead of inline). The deco
  letter lands at the right margin (x≈553-571) while the word body sits centered
  (x≈279-322) - the deco is NOT above its word. Identical breakage for logical and
  pre-reversed input (`deco-logical.pdf` / `deco-reversed.pdf`, page 1).
- **`position:absolute` deco (bottom:100%)**: also broken - deco box overlaps the body
  line (deco y 618-669 vs body y 636-663) and is horizontally misaligned (variant 3).
- **`display:flex` WORKS**: `display:flex;flex-direction:row` wrapper + per-word
  `display:flex;flex-direction:column;align-items:center` gives exactly the target look
  (`deco-variants.pdf` page 2, row 4): deco letters at the same baseline (y=60.99) above
  their bodies (y=114.57), words side by side in RTL order, whole line centered, nikud
  intact (אַ, בֶּ with marks).

### Quirk: deco letter slightly off-center over word

In the flex row the deco glyph box sits ~6.7 pt right of the word-body center (page 2,
row 4: deco `אַ` center 329.2 vs body `בְרָהָם` center 322.5). Likely the niqqud mark's
bearing inflates the deco box on the left. Minor; Phase 3 can compensate with
`margin-inline-start` on the deco or `letter-spacing` on the column.

### Conclusion for Phase 3

Use **flex columns** for the decorated-word layout (not inline-block). Plain text needs
no reversal - Folio's bidi is correct for Hebrew paragraphs with `dir="rtl"`.
`Intl.Segmenter` cluster-splitting for "big first letter" works (first grapheme cluster
includes its nikud).

## P2-05 page size / pagination

- **Explicit page breaks**: `page-break-before:always` honored - sheet.pdf = 2 pages for
  2 `.page` divs. Content overflow also paginates (deco-logical.pdf overflows to page 2).
- **Custom `@page{size:1080px 1920px}`**: WORKS - phone.pdf is 810×1440 pt exactly
  (1080×1920 px @ 0.75 pt/px, 96 dpi), 1 page, overrides `pageSize:"a4"` fallback.
- **AutoHeight `@page{size:1080px 0}`**: WORKS - autoheight.pdf is a single continuous
  page, 810×255.6 pt (height = content). **Quirk**: the JS result object reports
  `height: 0` for autoheight (width=810 is correct) - the actual PDF page height is fine;
  don't trust `result.height` for autoheight pages in Phase 3.

## Folio quirks list (feed Phase 3)

1. `display:inline-block` with a block child is rendered as a stacked block (words no
   longer inline; deco detaches to the start edge). Use flex.
2. `position:absolute` (bottom:100% above an inline/word box) mispositions - overlaps
   the next line. Avoid absolute deco; use flex column.
3. **Font fallback is effectively off for @font-face-only docs**: Latin/digits in a
   Hebrew-only font render as `.notdef` (blank, zero-gid) - "variant 1" headers in
   `deco-variants.pdf` are invisible. The spike fonts (NotoSerifHebrew Regular/Bold)
   contain 0 Latin glyphs. Phase 3 must either use fonts with Latin coverage or style
   Hebrew and Latin text with separate families, and test mixed lines.
4. **PDF text extraction is unreliable**: embedded subset fonts have degenerate cmaps
   (ToUnicode maps everything to NUL; subset cmap has 1-7 entries). Folio compensates by
   emitting `ActualText` spans carrying the logical text - `pdftotext`/copy works via
   those, but raw glyph extraction does not. If Phase 3 needs searchable/selectable text
   beyond what ActualText provides, verify on real output.
5. `result.height` = 0 for autoheight pages (see above).
6. Render latency is excellent: 14-50 ms wall per page-size doc once the wasm instance is
   warm (spans: html-parse ~10-16 ms, total 14-47 ms).
7. `%PDF-`-only output (`out/test.pdf`, 5 bytes, deleted): a truncated PDF header -
   cause: an interrupted render/save from the earlier session (partial base64 of the PDF
   header only), not an error string and not reproducible through the harness (all named
   tests save complete PDFs). If it recurs, suspect Folio's streaming path
   (`streamingThreshold`) under worker termination.
8. Font sizes in PDFs are exact CSS px→pt at 96 dpi (37.05 pt = 49.4 px deco, etc.) -
   no scaling surprises; poppler's pdf2xml coordinates are ×1.5 of pdfinfo's pt space,
   so don't mix them.

## Repro commands

```bash
# serve harness (from spikes/folio-wasm/)
node server.js 8321            # then open http://localhost:8321/?test=all
# inspect a result
pdfinfo out/phone.pdf
pdftotext -bbox out/deco-variants.pdf -   # word boxes (ActualText-driven)
pdftoppm -png -r 96 out/deco-variants.pdf out/deco-variants   # eyeball PNGs
```
