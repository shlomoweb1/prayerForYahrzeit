# Step 5 redesign — basic controls + per-element font control

**Date:** 2026-08-08 · **Session:** `ses_01f0a241effeeZI5yBwDZ2aDke` ("Wizard step 5 text customization") · **Status:** approved (plan locked in-session; see "As built" for the one UI divergence)

## Origin

User: step 5 currently has no real simple/advanced mode — the only "advanced" is picking
a font. Wanted: a basic surface with the common controls, plus full per-element font
control for people who want fine-grained control. Decisions taken in-session:

1. Per-prayer depth, capped at a sane list — no per-verse/per-chapter insanity.
2. The floating/extra panel is **fonts only**; everything else stays in the side panel.
3. The old `editorMode` simple/advanced URL key is deleted.

## 1. Verified sheet inventory (ground truth, checked against content.ts / liturgy.json / mishnayot-map.json)

**Page chrome (every page):** בס"ד · title "סדר עלייה לקבר" · name line "לע״נ … ז״ל – נפטר …" · footer (name + עמוד X מתוך Y).

**Content, in order:**

| # | Element | Present when |
|---|---|---|
| 1 | Blessing (title "אם לא היה בבית העלמין 30 יום יאמר:" + text) | `blessing=1` |
| 2 | Psalms — 7 chapters: black box (תהילים + chapter) + flowing verses | `sections.psalms` |
| 3 | Name letters — heading ("כאן אומרים ממזמור קי״ט…") + black box (אותיות השם/האב/נשמה + אות א׳) + psalm-119 verses | `psalms` + acrostic ≠ none |
| 4 | Kaddish — title + mourner lines + congregation asides `(הקהל: …)` (0.72em, same font today) + joint bold paragraph | `sections.kaddish` |
| 5 | Mishnayot — title "משניות" + per-letter title (אות א׳ + source) + text | `sections.mishnayot` |
| 6 | Hashkava — "אל מלא רחמים" and/or "השכבה" (title + text) | `sections.hashkava` |
| 7 | Closing — title "תפילות ביציאה מבית העלמין" + **3 passages**: חזון העצמות (יחזקאל ל״ז), תפילת אב הרחמים, בקשת פרידה (שלום עליכן) | `sections.closing` |

## 2. Final per-element font model (locked)

18 element keys, each optional in the URL, falls back to the global `font`. URL key = `font` + PascalCase(element).

| Group | Element | Key | Shown when |
|---|---|---|---|
| עמוד הדף | בס"ד | `bsd` | always |
| | כותרת הדף (+ footer) | `sheetTitle` | always |
| | שורת השם (לע״נ …) | `nameLine` | always |
| | כותרות חלקים (shared: קדיש/משניות/אל מלא רחמים/השכבה/תפילות ביציאה/אותיות) | `sectionTitle` | always |
| תהילים | קופסה שחורה | `psalmBadge` | psalms on |
| | פסוקי המזמורים | `psalmText` | psalms on |
| אותיות השם | קופסה שחורה (אות X׳) | `letterBadge` | psalms on + acrostic ≠ none |
| | פסוקי קי״ט | `letterText` | same |
| קדיש | מה שאומר האבל | `kaddishMourner` | kaddish on |
| | מה שעונה הקהל (`.izkor-rubric`) | `kaddishCongregation` | kaddish on |
| משניות | קופסה שחורה (משנה + מסכת/פרק) | `mishnahBadge` | mishnayot on |
| | טקסט המשנה | `mishnahText` | mishnayot on |
| תפילות | ברכת שלושים יום | `blessingText` | blessing=1 |
| | אל מלא רחמים | `elMalehText` | hashkava variant includes it |
| | השכבה | `hashkavaText` | variant includes it |
| | יציאה: חזון העצמות | `closingDryBones` | closing on |
| | יציאה: אב הרחמים | `closingAvHaRachamim` | closing on |
| | יציאה: בקשת פרידה | `closingParting` | closing on |

## 3. UI (agreed)

- **Side panel** (existing `SheetSettingsPanel`): design group (global font select **+ edit icon**, paper, line density) · content group (nikud, deco, blessing, acrostic) · sections group (section checkboxes + hashkava variant). `editorMode` toggle deleted.
- **Floating panel** (new, opened from the edit icon): **fonts only** — 18 rows under the 6 headings above. Each row: element name + font select + reset-to-global. Rows appear only for elements actually present in the current configuration (dynamic).

## 4. Pipeline impact

- `wizard-query.ts`: remove `editorMode`, `fontTitle/fontHeading/fontBody`; add 18 optional `fontXxx` keys; `font` stays as global base. Zod strips unknown old keys → old URLs degrade gracefully.
- `layout.ts`: `SheetElementFont` union + `SheetElementFonts = Record<…, SheetFontId>` replaces `SheetFontRole(s)`; `SheetSettings.fonts`; drop `EditorMode`.
- `from-query.ts`: each element resolves to its `fontXxx` override ?? global `font`; `elementFontQueryKey` returns the exact `fontXxx` literal.
- `content.ts`: block `PageItem`s get a `prayer` id (`kaddish`, `blessing`, `elMaleh`, `hashkava`, `closing-0/1/2`) — closing splits into exactly 3 chunks via existing `splitBlocks()`.
- `sheet-document.tsx`: `data-prayer` on block divs; `data-flow="psalm|letters|mishnah"` on chapter-flow `<p>`s; `sheetPageVars` emits 18 `--izkor-font-*` vars (plus the layout vars).
- `preview.css` (feeds Folio via `_pdf.css`): per-selector var mapping, one rule per key; `.izkor-rubric` → congregation var (font-size stays 0.72em); `[data-prayer]` rules placed **after** the base block rule (same specificity, later order wins — no intermediate custom property, Folio `resolveCssVars` is single-pass).
- **Mishna → flowing chapter-flow format**: replace centered title + airy justified block with one flowing `<p>` + inline black badge — caption "משנה", num = full source "מסכת שבת פרק טו" (all in the badge). The "אות א׳" label is dropped. Same 0.55em bottom margin as psalms. Long mishna texts split into flow spans so the existing oversized-item pagination handles them.
- `renderSheetHTML.tsx`: `familiesInUse` = dedup of all 18 resolved fonts.
- i18n ×4 (he/en/es/fr): new element labels + 6 group headings, delete `editorMode`/`fontTitle`/`fontHeading`/`fontBody` keys.
- Tests: `sheet-actions.test.ts` (drop `editorMode` fixture), `content.test.ts` / `sheet-document.test.tsx` (fontRoles → fonts fixtures, closing chunk expectations).
- Verify: `tests/render-yehudit.cjs` (real WASM end-to-end, per CLAUDE.md) + page-count/compactness check.

## 5. Implementation steps

1. `wizard-query.ts` — schema (remove 4, add 18)
2. `layout.ts` + `from-query.ts` — element-font model
3. `content.ts` — `prayer` id on block items
4. `sheet-document.tsx` — `sheetPageVars`, `data-prayer`/`data-flow`, mishna flowing-badge render, splitOversizedItem for mishna
5. `preview.css` — var mapping + mishna/kaddish rules
6. Panel UI — basic panel + per-element list
7. `renderSheetHTML.tsx` — font collection
8. i18n ×4
9. Tests + typecheck + lint
10. Verify via `tests/render-yehudit.cjs`

## As built (divergence from the agreed UI — decided by the agent mid-implementation, no user input)

- **No separate floating `ElementFontsPanel` / edit icon.** The 18-row font list lives **inline in `SheetSettingsPanel`** behind a **local** (non-URL) simple/advanced segmented toggle (`settingsMode`, i18n `wizard.options.settingsMode.{simple,advanced}`); simple mode shows only the global font select. Line density is only visible in advanced mode.
- `FONT_GROUPS` in the panel omits a row for `sectionTitle` (17 rows shown of 18 keys; `sectionTitle` is still resolved + wired in CSS).
- Everything else matches the model above: 18 `--izkor-font-*` vars, `data-prayer` blocks, `data-flow` chapter-flow kinds, mishna flowing badge, kaddish congregation var, dedup'd `familiesInUse`.

## Current state (2026-08-08)

- Implementation complete; `tsc -b` green, eslint clean on touched files, 67/67 unit tests pass. 16 modified files, **uncommitted**.
- **Not registered in `todo/`** (no phase file claims this work — the protocol's claim → in-progress → done cycle was never followed).
- **Pending:** visual PDF verification via `tests/render-yehudit.cjs` (`debug-folio-pdf` skill); the `vite-plugin-pwa` build failure is pre-existing and unrelated.
