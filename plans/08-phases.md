# 08 - Phases

Execution plan. Each phase maps to a `todo/` file; phases 1–2 can run in parallel on separate branches/worktrees.

| Phase | Title | Branch | todo file | Status |
|---|---|---|---|---|
| 1 | Web scaffold (P1-01..P1-08; P1-08 blocked on Firebase credentials) | `feat/web-scaffold` | `todo/phase-01-scaffold.md` | done |
| 2 | Folio WASM spike (P2-01..P2-05; findings in spikes/folio-wasm/FINDINGS.md) | `feat/folio-spike` | `todo/phase-02-wasm-spike.md` | done |
| 3 | Sheet builder (P3-01..P3-06; 20-page A4 PDF verified end-to-end) | `feat/sheet-builder` | `todo/phase-03-sheet-builder.md` | done |
| 4 | Data + fonts (P4-01..P4-05) | `feat/data-pipeline` | `todo/phase-04-data-and-fonts.md` | done |
| 5 | Firebase integration (Hosting rules/cache, Firestore schema + rules, Storage share flow, Auth anonymous/Google) | `feat/firebase` | `todo/phase-05-firebase.md` | pending |
| 6 | i18n/l10n completion (es, fr, en dictionaries complete; RTL/LTR QA; share/print polish; PWA) | `feat/i18n-and-share` | `todo/phase-06-i18n-and-share.md` | pending |
| 7 | A11y audit + launch (IS 5568 checklist, NVDA/JAWS/VoiceOver/TalkBack manual passes, Lighthouse ≥95, statement final, deploy) | `feat/a11y-launch` | `todo/phase-07-a11y-launch.md` | pending |

## Phase details & exit criteria

### Phase 1 - Scaffold
- Vite + React + TS strict; TanStack Router with `WizardQuery` zod schema wired to `validateSearch`
- Tailwind 4 CSS-first (`@theme`, rem tokens); shadcn/ui cloned into `components/ui` with **all physical→logical prop fixes** (`pl→ps` etc.)
- react-i18next: he (default) + en + es + fr skeleton dictionaries
- Reg-35 widget (FOUC bootstrap script, versioned localStorage, Alt+A) + `/accessibility` statement page
- CI: lint (incl. logical-prop eslint rule), typecheck, vitest, build; axe + Lighthouse ≥95; Playwright 375px + desktop + RTL smoke
- Exit: app renders wizard shell, URL-state round-trips, CI green.

### Phase 2 - Folio WASM spike
- `make wasm`; commit folio.wasm + wasm_exec.js; rebuild recipe doc
- Browser worker loader; hello-world Hebrew + data-URI font render
- Capture pipeline (off-screen mount → fonts.ready → 3-frame → innerHTML + stylesheet → wrapExamHTML port)
- Decorated-word render test (big letter above word, RTL, nikud) - highest risk
- `page-break-before` multi-page + custom `@page` share size
- Exit: a real multi-page sheet HTML renders to correct PDF bytes in the browser.

### Phase 3 - Sheet builder
- Layout model `SheetLayout` parameterized by `target` (print/share), paper, font, nikud, deco, sections
- Sections: header, blessing, 7 psalms, אותיות השם + נשמה (Psalm 119 acrostic), קדיש יתום, משניות, קדיש דרבנן/דאתחדתא, השכבה, closing prayers
- A4Page explicit page divs + flow; SheetPreview + PreviewScaleWrapper (mm-accurate)
- Step 6 split editor (desktop split / mobile accordions + sticky bar); step 7 review
- Exit: full sheet for a sample name renders identically in preview and generated PDF.

### Phase 4 - Data + fonts
- scripts: build-tehillim, harvest-itim (Playwright → liturgy.json, mishnayot-map, kaddish variants, closing prayers), build-letters (letter index)
- Fonts: curated ~6 families, copy-fonts.mjs with provenance check, LICENSE files, embedding verified in wasm
- Exit: `data/` committed; fonts render with nikud/cantillation in both preview and PDF.

### Phase 5 - Firebase
- Hosting + cache headers; Firestore rules; Storage share flow; anonymous + Google Auth; Analytics events
- Exit: generate → download + share-link end-to-end in staging.

### Phase 6 - i18n/l10n
- Complete dictionaries (es/fr UI; Spanish UI-only - no Spanish Tanakh)
- RTL/LTR QA, Playwright snapshots per locale; PWA install; print/share polish
- Exit: all UI strings translated, snapshots green.

### Phase 7 - A11y audit + launch
- IS 5568 checklist; manual SR matrix (NVDA/JAWS/VoiceOver/TalkBack); PDF SR testing (documented in statement)
- Lighthouse ≥95 in CI; statement finalized; deploy production; post-launch monitoring
- Exit: production live, statement published, audit report stored in `docs/`.

## Risks (top)

1. **Folio wasm Hebrew/decoration fidelity** - mitigated: Phase 2 spike first, examples/rtl/rtl.js as reference
2. **Custom share page size** - mitigated: `@page` override proven in main.go; spike includes it
3. **PDF screen-reader accessibility** - mitigated: honest statement + accessible HTML view fallback decision at launch
4. **itin harvest stability** - page layout may change; pin harvested artifacts as committed JSON (runtime fully offline)
5. **Font licensing** - provenance.tsv gates every font copy; fail CI on unlicensed files
