# Phase 4 — Data + Fonts

Branch: `feat/data-and-fonts` · Worktree: `.claude/worktrees/feat-data-and-fonts` · Depends on: —

Sources:
- Tehillim: `/home/shlomo-framowitz/Developments/daily-thielim/utils/scraper/data/processed/all-tehillim.json`
- itim: `https://itim.org.il/תפילות-לפי-שם-נפטר/?gender=male&nusach=ashkenaz&deceased_name=יונתן יוסף&parent=צבי מרדכי`
- Fonts: `/home/shlomo-framowitz/Developments/tziyun-berega/verify-legal-fonts/tmp/fonts-staging/system/` (+ provenance.tsv, seed-fonts.sh)

## P4-01 build-tehillim script → data/tehillim.json
Status: in-progress | Owner: agent-c | Started: 2026-08-02 | Deps: —
Details: normalize all-tehillim.json (drop unused fields, index by chapter; keep hebrew w/ nikud, transliteration, english, french). Output committed.
- [ ] data/tehillim.json generated + schema doc

## P4-02 itim harvest script → liturgy data
Status: pending | Owner: — | Started: — | Deps: —
Details: Playwright scrape of itim sheet → `data/liturgy.json` (fixed psalms, blessing, kaddish nusach variants, closing prayers, השכבה), `data/mishnayot-map.json` (letter → tractate/chapter). Handle page-layout drift; commit outputs (runtime fully offline).
- [ ] structured liturgy.json + mishnayot map verified against itim page

## P4-03 build-letters script → letter index
Status: pending | Owner: — | Started: — | Deps: P4-01
Details: `data/letter-index.json`: per letter → psalm-119 stanza verses (8 verses) + psalm-starter fallback list (verified map: א:[1,83,94,116,119,132] ב:[71,104,114] ה:15 ח:[56] י:[91,93,97,99] ל:73 מ:21 ע:[137] ר:[33,129] ש:19 ת:[17,86,90,102,145]). Nikud strip regex `[\u0591-\u05C7]` in lib.
- [ ] letter index generated + psalm-119 stanza extraction tested

## P4-04 Font curation
Status: pending | Owner: — | Started: — | Deps: —
Details: shortlist ~6 families (display + body-with-nikud, regular+bold) from staging/fork (Noto Serif/Sans/Rashi Hebrew, FrankRuhlLibre, TaameyFrankCLM, KeterYG, GveretLevin, DavidLibre); verify glyph coverage: 22 letters + nikud + cantillation.
- [ ] families chosen + coverage verified
- [ ] fonts committed to web/public/fonts/ with LICENSE files

## P4-05 copy-fonts.mjs with provenance gate
Status: pending | Owner: — | Started: — | Deps: P4-04
Details: script copies from staging/fork, verifies provenance.tsv tags (license, nikud/cantillation/letters-only); fails CI on unlicensed/untagged files.
- [ ] script + CI step
- [ ] embedding in wasm render verified (data-URI @font-face)
