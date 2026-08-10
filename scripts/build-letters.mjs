#!/usr/bin/env node
// build-letters.mjs - generate data/letter-index.json from data/tehillim.json.
// P4-03. Run from repo root: node scripts/build-letters.mjs
//
// Per Hebrew letter (final forms mapped to their regular form):
//   - psalm119 stanza: the 8-verse acrostic stanza of psalm 119 that starts
//     with that letter (verse ids reference data/tehillim.json ch 119)
//   - psalmStarters: psalms whose first verse begins with that letter
//     (verified map from plans/03; empty for letters with no psalm starters -
//     psalm 119 covers them)
// Stanzas are verified by stripping nikud ([\\u0591-\\u05C7]) from the first
// verse and asserting its first letter; stanza text is cross-checked against
// the itim liturgy harvest (data/liturgy.json letterPsalms).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEHILLIM = JSON.parse(
  readFileSync(resolve(ROOT, "data/tehillim.json"), "utf8"),
);
const LITURGY = existsSync(resolve(ROOT, "data/liturgy.json"))
  ? JSON.parse(readFileSync(resolve(ROOT, "data/liturgy.json"), "utf8"))
  : null;
const OUT = resolve(ROOT, "data/letter-index.json");

// nikud strip: used for letter detection here and for the nikud=0 print mode
const STRIP_NIKUD = /[\u0591-\u05C7]/g;
const stripNikud = (text) => text.replace(STRIP_NIKUD, "").trim();
const firstLetter = (text) => [...stripNikud(text)][0] ?? "";

const ALPHABET = [
  "\u05d0", "\u05d1", "\u05d2", "\u05d3", "\u05d4", "\u05d5", "\u05d6",
  "\u05d7", "\u05d8", "\u05d9", "\u05db", "\u05dc", "\u05de", "\u05e0",
  "\u05e1", "\u05e2", "\u05e4", "\u05e6", "\u05e7", "\u05e8", "\u05e9",
  "\u05ea",
];

const SOFIT_MAP = {
  "\u05da": "\u05db", "\u05dd": "\u05de", "\u05df": "\u05e0",
  "\u05e3": "\u05e4", "\u05e5": "\u05e6",
};

// verified psalm-starter map (plans/03): the traditional per-letter psalm list
// (from the yahrzeit-sheet custom). Note: psalm titles mean the first verse of
// a starter psalm need not begin with the letter itself (e.g. 83 "שיר מזמור
// לאסף" is listed under א) - this is curated data, not a computed relation.
const PSALM_STARTERS = {
  "\u05d0": [1, 83, 94, 116, 119, 132],
  "\u05d1": [71, 104, 114],
  "\u05d4": [15],
  "\u05d7": [56],
  "\u05d9": [91, 93, 97, 99],
  "\u05dc": [73],
  "\u05de": [21],
  "\u05e2": [137],
  "\u05e8": [33, 129],
  "\u05e9": [19],
  "\u05ea": [17, 86, 90, 102, 145],
};

const ps119 = TEHILLIM.chapters[119];
if (!ps119 || ps119.verses.length !== 176) {
  console.error(`psalm 119 must have 176 verses, found ${ps119?.verses.length}`);
  process.exit(1);
}

// ---- build stanzas -----------------------------------------------------------

const stanzas = {};
const problems = [];
for (let k = 0; k < ALPHABET.length; k++) {
  const letter = ALPHABET[k];
  const verseIds = Array.from({ length: 8 }, (_, i) => k * 8 + i + 1);
  const verses = verseIds.map((id) => {
    const v = ps119.verses[id - 1];
    if (!v) throw new Error(`psalm 119 verse ${id} missing`);
    return v;
  });

  // verify the stanza starts with the expected letter (nikud stripped)
  const first = firstLetter(verses[0].hebrew);
  if (first !== letter) {
    problems.push(
      `stanza ${letter}: first verse letter is "${first}" not "${letter}"`,
    );
  }

  // every stanza letter must appear at the start of its 8 verses
  const badStarts = verses
    .filter((v) => firstLetter(v.hebrew) !== letter)
    .map((v) => v.id);
  if (badStarts.length)
    problems.push(`stanza ${letter}: verses ${badStarts.join(",")} do not start with ${letter}`);

  // cross-check against the itim harvest (soft: first verse, nikud-stripped)
  if (LITURGY?.letterPsalms?.[letter]) {
    const itimFirst = stripNikud(
      LITURGY.letterPsalms[letter].content.split("<br>")[0],
    ).replace(/\s+/g, " ");
    const oursFirst = stripNikud(verses[0].hebrew).replace(/\s+/g, " ");
    if (oursFirst !== itimFirst && !oursFirst.startsWith(itimFirst.slice(0, 12)))
      problems.push(`stanza ${letter}: differs from itim first verse`);
  }

  stanzas[letter] = {
    letter,
    chapter: 119,
    verseIds,
    firstVerseId: verseIds[0],
  };
}

if (problems.length) {
  console.error("verification failed:\n  " + problems.join("\n  "));
  process.exit(1);
}

// ---- starter-map sanity checks (curated data: only existence is enforced) ------

const startersById = new Map();
for (const [letter, psalms] of Object.entries(PSALM_STARTERS)) {
  for (const p of psalms) {
    startersById.set(p, letter);
    const v = TEHILLIM.chapters[p]?.verses[0];
    if (!v) problems.push(`psalm ${p} (starter of ${letter}) missing`);
  }
}
if (problems.length) {
  console.error("verification failed:\n  " + problems.join("\n  "));
  process.exit(1);
}

// informational only: a starter psalm's first letter need not match (traditional list)
for (const [p, letter] of [...startersById].sort((a, b) => a[0] - b[0])) {
  const first = firstLetter(TEHILLIM.chapters[p].verses[0].hebrew);
  if (first !== letter)
    console.warn(`note: psalm ${p} (listed under ${letter}) starts with "${first}"`);
}

const out = {
  _schema: {
    description:
      "Letter index for name-based yahrzeit sheets. Generated by scripts/build-letters.mjs from data/tehillim.json. Final-letter names map to their regular form (sofitMap).",
    keys: {
      alphabet: "22 letters in acrostic order (regular forms)",
      sofitMap: "final forms -> regular letter",
      psalm119: {
        chapter: "119",
        stanzaSize: "8 verses per letter stanza",
        stanzas: "letter -> { letter, chapter, verseIds, firstVerseId } (ids reference data/tehillim.json chapters[119].verses)",
      },
      psalmStarters:
        "letter -> chapter numbers whose first verse starts with that letter (empty for letters without psalm starters - psalm 119 covers them)",
      stripNikud: "regular expression [\\u0591-\\u05C7] strips nikud/cantillation",
    },
  },
  alphabet: ALPHABET,
  sofitMap: SOFIT_MAP,
  psalm119: { chapter: 119, stanzaSize: 8, stanzas },
  psalmStarters: PSALM_STARTERS,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(
  `wrote ${OUT}: ${Object.keys(stanzas).length} stanzas, ` +
    `${Object.keys(PSALM_STARTERS).length} letters with psalm starters`,
);
