#!/usr/bin/env node
// build-tehillim.mjs - normalize all-tehillim.json -> data/tehillim.json
// P4-01. Run from repo root: node scripts/build-tehillim.mjs
//
// Source: daily-thielim scraper processed dataset (offline, committed output).
// Recovery: the scraper's parser dropped verses that break its `^\{` regex:
//   - verses prefixed with "(פ)" (stanza/section markers) - ch 107 v23, ch 119 v9,17,...,169
//   - verse 1 embedded in the page title line (missing "{") - ch 56, 83, 99, 129, 132
//   The index-zip then misaligned translit/en/fr for the title-line chapters.
//   These 7 chapters are rebuilt from the source site's live pages (fallback:
//   local scraper HTML cache), which are complete and aligned.
//   The remaining 143 chapters are taken from the processed dataset as-is.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC =
  "/home/shlomo-framowitz/Developments/daily-thielim/utils/scraper/data/processed/all-tehillim.json";
const CACHE =
  "/home/shlomo-framowitz/Developments/daily-thielim/utils/scraper/data/cache";
const OUT = resolve(ROOT, "data/tehillim.json");

// chapters the scraper produced with missing/misaligned verses
const RECOVERY_CHAPTERS = [56, 83, 99, 107, 119, 129, 132];
const EN_URL = (n) => `https://tehillim-online.com/psalms-of-david/Tehillim-${n}`;
const FR_URL = (n) => `https://tehilim-online.com/les-psaumes-de-David/Tehilim-${n}`;

// ---- html helpers ----------------------------------------------------------

const STANZA_LETTERS = new Set(
  [
    "alef", "aleph", "bet", "gumel", "guimel", "gimel", "dlet", "dalet",
    "he", "vav", "zyin", "zayin", "chet", "tet", "iod", "yod", "caf",
    "kaf", "lmed", "lamed", "mem", "nun", "smech", "samech", "yin",
    "ayin", "pe", "tsdic", "tsadic", "tsadi", "tsade", "cuf", "kuf",
    "resh", "shin", "taf", "tav",
  ].map((s) => s.toLowerCase()),
);

// latin-1 + common punctuation entity decoding (cache/live pages are entity-encoded)
const ENTITIES = {
  aacute: 225, agrave: 224, acirc: 226, auml: 228, aring: 229, atilde: 227,
  aelig: 230, ccedil: 231, eacute: 233, egrave: 232, ecirc: 234, euml: 235,
  iacute: 237, igrave: 236, icirc: 238, iuml: 239, ntilde: 241, oacute: 243,
  ograve: 242, ocirc: 244, ouml: 246, oslash: 248, szlig: 223, uacute: 250,
  ugrave: 249, ucirc: 251, uuml: 252, yacute: 253, yuml: 255, oe: 339,
  rsquo: 8217, lsquo: 8216, rdquo: 8221, ldquo: 8220, ndash: 8211,
  mdash: 8212, hellip: 8230, nbsp: 160, apos: 39, amp: 38, lt: 60, gt: 62,
  quot: 34,
};
const decodeEntities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z0-9]+);/gi, (m, name) =>
      ENTITIES[name.toLowerCase()] !== undefined
        ? String.fromCodePoint(ENTITIES[name.toLowerCase()])
        : m,
    );

const fetchText = async (url) => {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
};

// slice a block from `id="X"` up to the next top-level `<div id=`
const getBlock = (html, id) => {
  const start = html.indexOf(`id="${id}"`);
  if (start === -1) return "";
  const next = html.indexOf("<div id=", start + 10);
  return html.slice(start, next < 0 ? html.length : next);
};

const stripTags = (s) =>
  s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

// lines of a block, <br>-split, tags stripped, entities decoded
const blockLines = (block) =>
  block
    .replace(/^.*?>(?=\s*\S)/s, "")
    .replace(/<\/div>\s*$/s, "")
    .split(/<br\s*\/?>/i)
    .map((l) => decodeEntities(stripTags(l)))
    .filter(Boolean);

// per-<p> verse lines (translit/en/fr blocks are <p>-structured)
const paraLines = (block) =>
  [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => m[1].split(/<br\s*\/?>/i).map((l) => decodeEntities(stripTags(l))).filter(Boolean))
    .filter((lines) => lines.length > 0);

const isStanzaLetter = (line) => {
  const word = line
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return STANZA_LETTERS.has(word);
};

// ---- chapter recovery -------------------------------------------------------

// hebrew block -> [{hebrewId, hebrew}]
const parseHebrew = (block) => {
  const verses = [];
  for (const line of blockLines(block)) {
    let m = line.match(/^(?:\(\u05e4\)\s*)?\{([\u05d0-\u05ea]+)\}\s*(.*)$/);
    if (m) {
      if (m[2]) verses.push({ hebrewId: m[1], hebrew: m[2] });
      continue;
    }
    // title line with verse 1 embedded: "Psalm 56 א} <text>"
    m = line.match(
      /Psalm \d+\s*(?:\(\u05e4\)\s*)?\{?([\u05d0-\u05ea]+)\}?\s*(.*)$/,
    );
    if (m && m[2]) verses.push({ hebrewId: m[1], hebrew: m[2] });
  }
  return verses;
};

// translit/en/fr block -> verse lines (stanza letter markers dropped).
// mergeContinuations joins wrapped verse lines (lowercase-start, only valid
// for transliteration where every verse line starts with a capital).
const parseTexts = (block, stripNumber, mergeContinuations = false) => {
  const out = [];
  for (const p of paraLines(block)) {
    let lines = p;
    if (lines.length > 1 && isStanzaLetter(lines[0])) lines = lines.slice(1);
    else if (lines.length === 1 && isStanzaLetter(lines[0])) continue;
    for (const line of lines) {
      const clean = line.replace(stripNumber, "").trim();
      if (!clean) continue;
      if (mergeContinuations && /^[a-z]/.test(clean) && out.length)
        out[out.length - 1] += " " + clean;
      else out.push(clean);
    }
  }
  return out;
};

const EN_NUM = /^\d+\.\s*/;
const FR_NUM = /^\d+\s+/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// rebuild one chapter from live pages (cache fallback)
const recoverChapter = async (n) => {
  const cacheEn = resolve(CACHE, `tehillim-${n}-english.html`);
  const cacheFr = resolve(CACHE, `tehillim-${n}-french.html`);
  const cacheHe = resolve(CACHE, `tehillim-${n}.html`);

  const parse = (enHtml, frHtml) => {
    const hebrew = parseHebrew(getBlock(enHtml, "tehilimBlock"));
    const translit = parseTexts(getBlock(enHtml, "phonetiqueBlock"), /^/, true);
    const english = parseTexts(getBlock(enHtml, "traductionBlock"), EN_NUM);
    const french = parseTexts(getBlock(frHtml, "traductionBlock"), FR_NUM);
    const counts = [hebrew, translit, english, french].map((a) => a.length);
    if (counts.some((c) => c !== counts[0])) {
      throw new Error(
        `chapter ${n}: language block lengths differ: hebrew=${counts[0]} translit=${counts[1]} english=${counts[2]} french=${counts[3]}`,
      );
    }
    if (hebrew.length === 0) throw new Error(`chapter ${n}: no verses recovered`);
    return { hebrew, translit, english, french };
  };

  let parts = null;
  for (const attempt of [0, 1]) {
    if (attempt) await sleep(3000);
    try {
      const enHtml = await fetchText(EN_URL(n));
      const frHtml = await fetchText(FR_URL(n));
      parts = parse(enHtml, frHtml);
      break;
    } catch (err) {
      console.warn(`  ch ${n}: live fetch failed (${err.message}), retrying/falling back...`);
    }
  }
  if (!parts) {
    if (
      !existsSync(cacheEn) ||
      !existsSync(cacheFr) ||
      !existsSync(cacheHe)
    ) {
      throw new Error(`chapter ${n}: no live data and incomplete cache`);
    }
    const enHtml = readFileSync(cacheEn, "utf8");
    const frHtml = readFileSync(cacheFr, "utf8");
    parts = parse(enHtml, frHtml);
  }
  const { hebrew, translit, english, french } = parts;

  return {
    chapterNumber: n,
    totalVerses: hebrew.length,
    verses: hebrew.map((v, i) => ({
      id: i + 1,
      hebrewId: v.hebrewId,
      hebrew: v.hebrew,
      transliteration: translit[i] || "",
      english: english[i] || "",
      french: french[i] || "",
    })),
  };
};

// ---- main -------------------------------------------------------------------

const raw = JSON.parse(readFileSync(SRC, "utf8"));

const chapters = {};
for (const ch of raw.chapters) {
  chapters[ch.chapterNumber] = {
    totalVerses: ch.totalVerses,
    verses: ch.verses.map((v) => ({
      id: v.id,
      hebrewId: v.hebrewId,
      hebrew: v.hebrew,
      transliteration: v.transliteration,
      english: v.english,
      french: v.french,
    })),
  };
}

console.log(`recovering ${RECOVERY_CHAPTERS.join(", ")} from live pages...`);
for (const n of RECOVERY_CHAPTERS) {
  const ch = await recoverChapter(n);
  chapters[n] = { totalVerses: ch.totalVerses, verses: ch.verses };
  console.log(
    `  ch ${n}: ${ch.totalVerses} verses (${ch.verses.filter((v) => !v.english).length} without english translation)`,
  );
}

// ---- validation --------------------------------------------------------------

let problems = [];
let recoveredOverlapMismatch = 0;
for (const n of Object.keys(chapters).map(Number)) {
  const ch = chapters[n];
  if (ch.verses.length !== ch.totalVerses)
    problems.push(`ch ${n}: verses ${ch.verses.length} != totalVerses ${ch.totalVerses}`);
  ch.verses.forEach((v, i) => {
    if (v.id !== i + 1) problems.push(`ch ${n}: id gap at ${i + 1}`);
    if (!v.hebrew) problems.push(`ch ${n}: empty hebrew at verse ${i + 1}`);
    if (RECOVERY_CHAPTERS.includes(n)) {
      const orig = raw.chapters.find((c) => c.chapterNumber === n);
      const origV = orig?.verses.find((o) => o.hebrewId === v.hebrewId);
      if (origV && origV.hebrew !== v.hebrew) recoveredOverlapMismatch++;
    }
  });
}
if (problems.length) {
  console.error("validation failed:\n" + problems.slice(0, 20).join("\n"));
  process.exit(1);
}
if (recoveredOverlapMismatch)
  console.warn(`warning: ${recoveredOverlapMismatch} recovered verses differ from processed dataset (source site edited)`);

const SCHEMA = {
  _schema: {
    description:
      "Normalized Tehillim dataset, indexed by chapter. Generated by scripts/build-tehillim.mjs. Runtime use is fully offline.",
    keys: {
      chapters: "object: chapterNumber -> chapter",
      chapter: {
        totalVerses: "number of verses in the chapter",
        verses: "array of verse objects",
      },
      verse: {
        id: "1-based verse number within the chapter",
        hebrewId: "Hebrew numeral label of the verse (alef..mem-heh)",
        hebrew: "verse text with nikud (cantillation marks included)",
        transliteration: "latin transliteration",
        english: "english translation (may be empty)",
        french: "french translation (may be empty)",
      },
    },
    stripNikud: "regular expression [\\u0591-\\u05C7] strips nikud/cantillation from hebrew text",
    recovery: {
      chapters: RECOVERY_CHAPTERS,
      reason:
        "the upstream scraper dropped verses prefixed with (פ) and title-embedded verse 1, then index-zipped translations, misaligning them. These chapters were re-harvested from the source site (live pages, local scraper cache as fallback) where all languages are complete and aligned.",
    },
  },
};

const out = {
  ...SCHEMA,
  metadata: {
    totalChapters: raw.metadata.totalChapters,
    totalVerses: Object.values(chapters).reduce((a, c) => a + c.verses.length, 0),
    source: raw.metadata.source,
    generatedAt: raw.metadata.generatedAt,
  },
  chapters,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(
  `wrote ${OUT}: ${Object.keys(chapters).length} chapters, ${out.metadata.totalVerses} verses`,
);
