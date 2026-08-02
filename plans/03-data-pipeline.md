# 03 — Data Pipeline

## Sources

- **Psalms (תהלים)**: `/home/shlomo-framowitz/Developments/daily-thielim/utils/scraper/data/processed/all-tehillim.json`
  - Shape: `{"metadata", "chapters": [{chapterNumber, verses: [{id, hebrewId("א"), hebrew(nikud), transliteration, english, french}], scrapedAt, sourceUrl, totalVerses}]}`
  - Also: `daily-thielim/utils/scraper/` (scraper source if regeneration needed)
- **Liturgy & letter mappings**: harvest from itim.org.il yahrzeit sheet page (server-rendered, no API):
  - `https://itim.org.il/תפילות-לפי-שם-נפטר/?gender=male&nusach=ashkenaz&deceased_name=יונתן יוסף&parent=צבי מרדכי`
  - Harvest once via Playwright script into `data/` as structured JSON (liturgy.json: fixed psalms, kaddish variants, mishnayot mapping, closing prayers, blessing texts).

## Sheet content model (per itim.org.il)

1. Header: `תפילות ולימוד לע"נ [שם] בן/בת [שם האב] ז"ל`
2. Blessing: `אשר יצר אתכם בדין` (only if deceased < 30 days — optional setting)
3. **7 fixed psalms**: לג, טז, יז, עב, צא, קד, קל
4. **אותיות השם** — letters of the name via **Psalm 119 acrostic stanzas** (22 letters × 8 verses per letter; final letters ן/ף → נ/פ)
5. **אותיות נשמה** — the same stanza mechanism
6. **קדיש יתום** per nusach (אשכנז / ספרד variants)
7. **משניות** per name letter (from itim): י→יומא ח, ו→דמאי ב, נ→שבת כא, ת→ברכות ד (harvest full mapping)
8. **קדיש דרבנן** + **קדיש דאתחדתא**
9. **השכבה** (memorial prayer)
10. **תפילות ביציאה מבית העלמין** (closing prayers)

## Letter → psalm facts (data analysis, verified)

- Only **11 letters** start psalms: א:[1,83,94,116,119,132] ב:[71,104,114] ה:15 ח:[56] י:[91,93,97,99] ל:73 מ:21 ע:[137] ר:[33,129] ש:19 ת:[17,86,90,102,145]
- Missing as psalm starters: ג ד ו ז ט כ נ ס פ צ ק
- **Psalm 119 covers all 22 letters** (one 8-verse stanza per letter) → the acrostic fallback for any name letter.
- Verse-initial letters across all psalms cover every letter (incl. `(`) — full alphabet coverage for verse-based acrostics if ever needed.
- Nikud strip regex: `[\u0591-\u05C7]`

## Build scripts (`scripts/`)

1. `build-tehillim.mjs` — normalize all-tehillim.json → `data/tehillim.json` (drop unused fields, index by chapter; keep hebrew-with-nikud, transliteration, english, french)
2. `harvest-itim.mjs` — Playwright scrape of itim sheet → `data/liturgy.json` + `data/mishnayot-map.json` (letter → tractate/chapter), `data/kaddish-nusach.json`, fixed psalms list, closing prayers
3. `build-letters.mjs` — generate `data/letter-index.json`: for each letter → psalm-119 stanza verses + fallback first-letter psalms (from the verified map above)
4. Outputs are committed (no runtime network dependency — the sheet generator must work fully offline).

## Runtime access

`web/src/lib/tehillim/` + `web/src/lib/liturgy/` — typed modules over `data/*.json` (imported statically or via TanStack Query cache). Psalm rendering strips nikud where needed (`nikud=0` setting) using the strip regex; transliteration/EN/FR only for optional reader aids (UI decision pending — likely print stays pure Hebrew).
