#!/usr/bin/env node
// harvest-itim.mjs — harvest the itim.org.il yahrzeit sheet into liturgy data.
// P4-02. Run from repo root: node scripts/harvest-itim.mjs
//
// The sheet's full content (prayers, kaddish variants, psalm-119 stanzas,
// mishnayot letter map) is embedded in the page as the `contentData` JS object.
// This script loads the page with Playwright (chromium) when available
// (npm i in scripts/ or any resolvable playwright install), waits for the
// client-side render, and cross-checks the rendered DOM against the embedded
// data. Falls back to a plain fetch when playwright is not installed.
// Outputs (committed, runtime fully offline): data/liturgy.json,
// data/mishnayot-map.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_LITURGY = resolve(ROOT, "data/liturgy.json");
const OUT_MISHNAYOT = resolve(ROOT, "data/mishnayot-map.json");

const ITIM_URL =
  "https://itim.org.il/%D7%AA%D7%A4%D7%99%D7%9C%D7%95%D7%AA-%D7%9C%D7%A4%D7%99-%D7%A9%D7%9D-%D7%A0%D7%A4%D7%98%D7%A8/?" +
  "gender=male&nusach=ashkenaz&deceased_name=%D7%99%D7%95%D7%A0%D7%AA%D7%9F%20%D7%99%D7%95%D7%A1%D7%A3&parent=%D7%A6%D7%91%D7%99%20%D7%9E%D7%A8%D7%93%D7%9B%D7%99";

// expected fixed psalm chapters (from plans/03, verified against itim content)
const EXPECTED_PSALMS = [33, 16, 17, 72, 91, 104, 130];

// ---- html/js helpers -------------------------------------------------------

// extract the contentData object literal from the inline script (balanced
// brace scan that respects quoted strings) and evaluate it in a sandbox
const extractContentData = (html) => {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  for (const m of scripts) {
    const sc = m[1];
    const marker = "const contentData =";
    const start = sc.indexOf(marker);
    if (start === -1) continue;
    const objStart = sc.indexOf("{", start);
    let i = objStart,
      depth = 0,
      inStr = false,
      esc = false;
    for (; i < sc.length; i++) {
      const c = sc[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') {
        inStr = true;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    const literal = sc.slice(objStart, i + 1);
    const box = {};
    vm.runInNewContext("contentData = " + literal, box);
    if (box.contentData?.nusach) return box.contentData.nusach;
  }
  throw new Error("contentData not found in page HTML");
};

const stripTags = (s) => s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

// hebrew numeral -> integer
const HEBREW_NUM = {
  "\u05d0": 1, "\u05d1": 2, "\u05d2": 3, "\u05d3": 4, "\u05d4": 5,
  "\u05d5": 6, "\u05d6": 7, "\u05d7": 8, "\u05d8": 9, "\u05d9": 10,
  "\u05db": 20, "\u05dc": 30, "\u05de": 40, "\u05e0": 50, "\u05e1": 60,
  "\u05e2": 70, "\u05e4": 80, "\u05e6": 90, "\u05e7": 100, "\u05e8": 200,
  "\u05e9": 300, "\u05ea": 400,
};
const hebrewToNumber = (s) =>
  [...s].reduce((acc, ch) => acc + (HEBREW_NUM[ch] || 0), 0);

// "מסכת שבת פרק טו" -> { tractate: "שבת", chapter: "טו", chapterNumber: 15 }
const parseSource = (source) => {
  const m = source.match(/^\u05de\u05e1\u05db\u05ea\s+(.+?)\s+\u05e4\u05e8\u05e7\s+([\u05d0-\u05ea]+)$/);
  if (!m) return { source, tractate: null, chapter: null, chapterNumber: null };
  return {
    source,
    tractate: m[1],
    chapter: m[2],
    chapterNumber: hebrewToNumber(m[2]),
  };
};

// extract fixed psalm chapter numbers from the "7 psalms" content
// ("פרק ל"ג" with quote-escaped numerals: ל"ג = 33)
const extractFixedPsalms = (content) => {
  const chapters = [];
  for (const m of content.matchAll(/\u05e4\u05e8\u05e7\s+([\u05d0-\u05ea"\\]+)/g)) {
    const letters = m[1].replace(/[^א-ת]/g, "");
    chapters.push(hebrewToNumber(letters));
  }
  return chapters;
};

// split "קדיש דאתחדתא" out of the derabanan kaddish content (ashkenaz)
const splitDeAtchadta = (content) => {
  const idx = content.indexOf("\u05e7\u05d3\u05d9\u05e9 \u05d3\u05d0\u05ea\u05d7\u05d3\u05ea\u05d0");
  if (idx === -1) return { derabanan: content, deAtchadta: null };
  return {
    derabanan: content.slice(0, idx).trim(),
    deAtchadta: content.slice(idx).trim(),
  };
};

// ---- loaders ----------------------------------------------------------------

const loadWithPlaywright = async () => {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(ITIM_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
    // the page auto-submits the form from URL params and renders the sheet
    await page.waitForFunction(
      () => {
        const el = document.getElementById("content-output");
        return el && el.children.length > 5;
      },
      null,
      { timeout: 90000 },
    );
    const html = await page.content();
    const domText = await page
      .evaluate(() => document.getElementById("content-output")?.innerText || "")
      .catch(() => "");
    return { html, domText };
  } finally {
    await browser.close();
  }
};

const loadWithFetch = async () => {
  const res = await fetch(ITIM_URL, {
    headers: { "user-agent": "izkor-harvest/1.0 (+https://github.com/izkor)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${ITIM_URL}`);
  return { html: await res.text(), domText: "" };
};

// ---- normalization -----------------------------------------------------------

const buildOutputs = (nusach, domText) => {
  const sections = (nu) => {
    const prayersBefore = nu.prayers_before.map((p) => ({
      title: p.title,
      content: p.content,
    }));
    const psalmsContent = prayersBefore.find((p) =>
      p.content.includes("\u05e4\u05e8\u05e7"),
    )?.content;
    const fixedPsalms = psalmsContent
      ? extractFixedPsalms(psalmsContent)
      : [];
    const kaddishDerabanan = splitDeAtchadta(nu.kaddish_derabanan.content);
    return {
      prayersBefore,
      fixedPsalms,
      kaddishYatom: nu.kaddish_yatom.content,
      kaddishDerabanan: kaddishDerabanan.derabanan,
      kaddishDeAtchadta: kaddishDerabanan.deAtchadta,
      hashkava: nu.prayers_after[0]?.content ?? "",
      closingPrayers: nu.prayers_after[1]?.content ?? "",
    };
  };

  const liturgy = {
    _schema: {
      description:
        "Liturgy for yahrzeit sheets, harvested from itim.org.il by scripts/harvest-itim.mjs. Hebrew texts retain <br>/<b> markup as line/emphasis structure. Runtime use is fully offline.",
      keys: {
        metadata: "harvest details",
        fixedPsalms: "the 7 fixed psalm chapter numbers (1-based, per tehillim.json)",
        letterPsalms:
          "psalm-119 acrostic stanza per letter as rendered by itim (reference text for the verse-id index in data/letter-index.json)",
        neshamaLetters: "letters of נשמה used for the second acrostic block",
        sofitMap: "final forms -> regular letter mapping (ך→כ, ם→מ, ן→נ, ף→פ, ץ→צ)",
        nusach: "per-nusach prayer texts: prayersBefore (blessing, grave prayer, 7 psalms), kaddishYatom, kaddishDerabanan (incl. kaddishDeAtchadta for ashkenaz), hashkava, closingPrayers",
      },
    },
    metadata: {
      harvestedAt: new Date().toISOString(),
      source: "https://itim.org.il/תפילות-לפי-שם-נפטר/",
      url: ITIM_URL,
      gender: "male",
      nusachRequested: "ashkenaz",
    },
    fixedPsalms: [],
    letterPsalms: {},
    neshamaLetters: nusach.shared.tehilim_letters.neshama,
    sofitMap: { "\u05da": "\u05db", "\u05dd": "\u05de", "\u05df": "\u05e0", "\u05e3": "\u05e4", "\u05e5": "\u05e6" },
    nusach: { ashkenaz: null, sepharad: null },
  };

  for (const nu of ["ashkenaz", "sepharad"]) {
    const s = sections(nusach[nu]);
    if (!liturgy.fixedPsalms.length && s.fixedPsalms.length)
      liturgy.fixedPsalms = s.fixedPsalms;
    liturgy.nusach[nu] = {
      prayersBefore: s.prayersBefore,
      kaddishYatom: s.kaddishYatom,
      kaddishDerabanan: s.kaddishDerabanan,
      kaddishDeAtchadta: s.kaddishDeAtchadta,
      hashkava: s.hashkava,
      closingPrayers: s.closingPrayers,
    };
  }

  for (const letter of Object.keys(nusach.shared.tehilim_letters)) {
    if (letter === "neshama") continue;
    const item = nusach.shared.tehilim_letters[letter];
    liturgy.letterPsalms[letter] = {
      title: item.title,
      content: item.content,
    };
  }

  const mishnayot = {
    _schema: {
      description:
        "Letter -> mishnah mapping for yahrzeit sheets, harvested from itim.org.il by scripts/harvest-itim.mjs. Each letter maps to one mishnah chapter (tractate/chapter from the source page).",
      keys: {
        letters: "letter -> { tractate, chapter, chapterNumber, source, text }",
        neshamaLetters: "letters of נשמה",
        sofitMap: "final forms -> regular letter mapping",
      },
    },
    metadata: { ...liturgy.metadata },
    letters: {},
    neshamaLetters: nusach.shared.mishnayot_letters.neshama,
    sofitMap: liturgy.sofitMap,
  };
  for (const letter of Object.keys(nusach.shared.mishnayot_letters)) {
    if (letter === "neshama") continue;
    const item = nusach.shared.mishnayot_letters[letter];
    mishnayot.letters[letter] = {
      ...parseSource(item.source),
      text: item.content,
    };
  }

  return { liturgy, mishnayot, domText };
};

// ---- validation --------------------------------------------------------------

const validate = (liturgy, mishnayot, domText) => {
  const problems = [];

  const fix = liturgy.fixedPsalms;
  if (JSON.stringify(fix) !== JSON.stringify(EXPECTED_PSALMS))
    problems.push(
      `fixedPsalms ${fix.join(",")} != expected ${EXPECTED_PSALMS.join(",")}`,
    );

  const letters = Object.keys(liturgy.letterPsalms).sort();
  if (letters.length !== 22)
    problems.push(`letterPsalms has ${letters.length} letters`);
  const mletters = Object.keys(mishnayot.letters).sort();
  if (mletters.length !== 22)
    problems.push(`mishnayot letters has ${mletters.length} letters`);
  if (JSON.stringify(letters) !== JSON.stringify(mletters))
    problems.push("letter sets differ between psalms and mishnayot");

  for (const [l, m] of Object.entries(mishnayot.letters)) {
    if (!m.tractate || !m.chapterNumber)
      problems.push(`letter ${l}: unparsed source "${m.source}"`);
    if (!m.text) problems.push(`letter ${l}: empty mishnah text`);
  }

  for (const nu of ["ashkenaz", "sepharad"]) {
    const s = liturgy.nusach[nu];
    if (!s.kaddishYatom) problems.push(`${nu}: missing kaddishYatom`);
    if (!s.kaddishDerabanan) problems.push(`${nu}: missing kaddishDerabanan`);
    if (!s.hashkava) problems.push(`${nu}: missing hashkava`);
    if (!s.closingPrayers) problems.push(`${nu}: missing closingPrayers`);
  }

  if (domText) {
    const expected = ["\u05e7\u05d3\u05d9\u05e9 \u05d9\u05ea\u05d5\u05dd", "\u05d4\u05e9\u05db\u05d1\u05d4", "\u05ea\u05e4\u05d9\u05dc\u05d5\u05ea \u05d1\u05d9\u05e6\u05d9\u05d0\u05d4 \u05de\u05d1\u05d9\u05ea \u05d4\u05e2\u05dc\u05de\u05d9\u05df", "\u05e7\u05d3\u05d9\u05e9 \u05d3\u05e8\u05d1\u05e0\u05df"];
    for (const t of expected)
      if (!domText.includes(t)) problems.push(`rendered DOM missing section "${t}"`);
  } else {
    console.warn("no rendered DOM captured (fetch path) — DOM cross-check skipped");
  }

  if (problems.length) {
    console.error("validation failed:\n  " + problems.join("\n  "));
    process.exit(1);
  }
};

// ---- main ---------------------------------------------------------------------

let nusach = null;
let domText = "";
try {
  console.log("loading with playwright...");
  const r = await loadWithPlaywright();
  nusach = extractContentData(r.html);
  domText = r.domText;
  console.log(`playwright ok, dom text ${domText.length} chars`);
} catch (err) {
  console.warn(`playwright failed (${err.message}); falling back to fetch`);
  const r = await loadWithFetch();
  nusach = extractContentData(r.html);
}

const { liturgy, mishnayot } = buildOutputs(nusach, domText);
validate(liturgy, mishnayot, domText);

mkdirSync(dirname(OUT_LITURGY), { recursive: true });
writeFileSync(OUT_LITURGY, JSON.stringify(liturgy, null, 2) + "\n");
writeFileSync(OUT_MISHNAYOT, JSON.stringify(mishnayot, null, 2) + "\n");

console.log(
  `wrote ${OUT_LITURGY} (fixed psalms: ${liturgy.fixedPsalms.join(",")})`,
);
console.log(
  `wrote ${OUT_MISHNAYOT} (${Object.keys(mishnayot.letters).length} letters)`,
);
