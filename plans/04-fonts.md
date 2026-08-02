# 04 — Fonts

## Inventory (verified)

- Staging: `/home/shlomo-framowitz/Developments/tziyun-berega/verify-legal-fonts/tmp/fonts-staging/system/` — **257 files**, each with `provenance.tsv` metadata (tags: `nikud`, `cantillation`, `letters-only`, `ofl`, `gpl`, category)
- Font fork: `/home/shlomo-framowitz/Developments/tziyun-berega/fonts/Fonts/` with coverage-taxonomy dirs: "Hebrew Letters only" / "with Vowels" / "with Vowels and Cantillation"
- Seeding script (reference): `/home/shlomo-framowitz/Developments/tziyun-berega/verify-legal-fonts/scripts/fonts/seed-fonts.sh`

## Candidate families (shortlist pending implementation)

- Noto Serif Hebrew, Noto Sans Hebrew, Noto Rashi Hebrew (with cantillation variants)
- FrankRuhlLibre
- TaameyFrankCLM (cantillation)
- KeterYG, GveretLevin, DavidLibre

## Requirements

1. **License-clean** — OFL/GPL-compatible only; provenance tracked; fonts committed into the repo under `web/public/fonts/` with license files.
2. **Nikud/cantillation support** — sheet must render Hebrew with vowels (and optionally cantillation marks) correctly shaped.
3. **Embedded per render** — in the Folio WASM world there is no BaseFS; every render embeds fonts as `@font-face` data URIs inside the generated HTML. Browser `folioRender` ignores `FontBaseDir` (Node-only).
4. **Weight coverage** — regular + bold at minimum for the selected families.

## Curation plan

- Pick a **display family** (headers/decorations) + **body family with nikud** (psalm text), each regular+bold.
- Verify rendering: glyph coverage for all 22 letters + nikud + cantillation marks in both Folio wasm and the on-screen preview.
- Target ~6 families max in the app; user-selectable in the wizard settings (font dropdown).

## Output

- `web/public/fonts/<family>/<weight>-<subset>.ttf` + LICENSE files
- `scripts/copy-fonts.mjs` — copies from staging/fork with provenance verification (fails on unlicensed/untagged files)
- Font preview test page (part of a11y/QA: readable font toggle uses the same families).
