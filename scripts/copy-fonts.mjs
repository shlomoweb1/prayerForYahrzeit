#!/usr/bin/env node
// copy-fonts.mjs — curate fonts into web/public/fonts/ (P4-05).
// Run from repo root: node scripts/copy-fonts.mjs
//
// Sources: tziyun-berega font fork + staging, each file must have a row in
// provenance.tsv with a license in {OFL, GPL, GPL+FE} and a coverage tag
// (nikud | cantillation | letters-only). Fails on unlicensed/untagged files.
// Output: web/public/fonts/<family>/<weight>-full.ttf + license file, and
// data/fonts-manifest.json (family, file, weight, tags, license, source,
// sha256, size).

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FORK_ROOT = "/home/shlomo-framowitz/Developments/tziyun-berega/fonts/Fonts";
const PROVENANCE = "/home/shlomo-framowitz/Developments/tziyun-berega/verify-legal-fonts/tmp/fonts-staging/provenance.tsv";
const OUT_DIR = resolve(ROOT, "web/public/fonts");
const MANIFEST = resolve(ROOT, "data/fonts-manifest.json");

const ALLOWED_LICENSES = new Set(["OFL", "GPL", "GPL+FE"]);
const COVERAGE_TAGS = ["nikud", "cantillation", "letters-only"];

// family -> weights + sources (paths verified against the fork)
const CT = "Hebrew Letters with Vowels and Cantillation";
const NV = "Hebrew Letters with Vowels (no cantillation)";
const FAMILIES = {
  NotoSerifHebrew: {
    category: "cantillation",
    licenseFile: "LICENSE_OFL.txt",
    licenseSource: `${CT}/Google (OFL)/NotoSerifHebrew/LICENSE_OFL.txt`,
    weights: [
      { weight: "regular", file: "NotoSerifHebrew-Regular.ttf", source: `${CT}/Google (OFL)/NotoSerifHebrew/NotoSerifHebrew-Regular.ttf` },
      { weight: "bold", file: "NotoSerifHebrew-Bold.ttf", source: `${CT}/Google (OFL)/NotoSerifHebrew/NotoSerifHebrew-Bold.ttf` },
    ],
  },
  NotoSansHebrew: {
    category: "cantillation",
    licenseFile: "LICENSE_OFL.txt",
    licenseSource: `${CT}/Google (OFL)/NotoSansHebrew/LICENSE_OFL.txt`,
    weights: [
      { weight: "regular", file: "NotoSansHebrew-Regular.ttf", source: `${CT}/Google (OFL)/NotoSansHebrew/NotoSansHebrew-Regular.ttf` },
      { weight: "bold", file: "NotoSansHebrew-Bold.ttf", source: `${CT}/Google (OFL)/NotoSansHebrew/NotoSansHebrew-Bold.ttf` },
    ],
  },
  NotoRashiHebrew: {
    category: "cantillation",
    licenseFile: "OFL.txt",
    licenseSource: `${CT}/Google (OFL)/NotoRashiHebrew/OFL.txt`,
    weights: [
      { weight: "regular", file: "NotoRashiHebrew-Regular.ttf", source: `${CT}/Google (OFL)/NotoRashiHebrew/static/NotoRashiHebrew-Regular.ttf` },
      { weight: "bold", file: "NotoRashiHebrew-Bold.ttf", source: `${CT}/Google (OFL)/NotoRashiHebrew/static/NotoRashiHebrew-Bold.ttf` },
    ],
  },
  FrankRuhlLibre: {
    category: "nikud",
    licenseFile: "OFL.txt",
    licenseSource: `${NV}/Yanek Iontef (OFL)/Frank_Ruhl_Libre/OFL.txt`,
    weights: [
      { weight: "regular", file: "FrankRuhlLibre-Regular.ttf", source: `${NV}/Yanek Iontef (OFL)/Frank_Ruhl_Libre/FrankRuhlLibre-Regular.ttf` },
      { weight: "bold", file: "FrankRuhlLibre-Bold.ttf", source: `${NV}/Yanek Iontef (OFL)/Frank_Ruhl_Libre/FrankRuhlLibre-Bold.ttf` },
    ],
  },
  TaameyFrankCLM: {
    category: "cantillation",
    licenseFile: "LICENSE.txt",
    licenseSource: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/TaameyFrank/LICENSE.txt`,
    gplText: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/TaameyAshkenaz/GPL-2.0.txt`,
    weights: [
      { weight: "medium", file: "TaameyFrankCLM-Medium.ttf", source: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/TaameyFrank/TaameyFrankCLM-Medium.ttf` },
      { weight: "bold", file: "TaameyFrankCLM-Bold.ttf", source: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/TaameyFrank/TaameyFrankCLM-Bold.ttf` },
    ],
  },
  KeterYG: {
    category: "cantillation",
    licenseFile: "LICENSE.TXT",
    licenseSource: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/KeterYG/LICENSE.TXT`,
    gplText: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/KeterYG/GNU-GPL.TXT`,
    weights: [
      { weight: "medium", file: "KeterYG-Medium.ttf", source: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/KeterYG/KeterYG-Medium.ttf` },
      { weight: "bold", file: "KeterYG-Bold.ttf", source: `${CT}/Culmus Project (GPL+FE)/Yoram Gnat (GPL+FE)/Taamey-Culmus/KeterYG/KeterYG-Bold.ttf` },
    ],
  },
};

// ---- provenance gate ----------------------------------------------------------

const tsv = readFileSync(PROVENANCE, "utf8").trim().split("\n").slice(1);
const prov = new Map();
for (const row of tsv) {
  const [file, family, category, source, locator, license, tags] = row.split("\t");
  prov.set(file, { file, family, category, source, locator, license, tags: tags.split(";") });
}

const failures = [];
const manifest = { _schema: {
  description: "Curated font families for izkor yahrzeit sheets. Generated by scripts/copy-fonts.mjs from the tziyun-berega font fork; every file provenance-verified (license + coverage tag). Files are full subsets (no subsetting) named <weight>-full.ttf. cantillation:false families lack Hebrew cantillation marks (U+0591-05AF) and should only be used for nikud-only rendering.",
}, families: [] };

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

for (const [family, cfg] of Object.entries(FAMILIES)) {
  const licenseSrc = resolve(FORK_ROOT, cfg.licenseSource);
  if (!existsSync(licenseSrc)) {
    failures.push(`${family}: license file missing at ${cfg.licenseSource}`);
    continue;
  }
  const entries = [];
  for (const w of cfg.weights) {
    const src = resolve(FORK_ROOT, w.source);
    if (!existsSync(src)) {
      failures.push(`${family}/${w.file}: source missing`);
      continue;
    }
    const meta = prov.get(w.file);
    if (!meta) {
      failures.push(`${family}/${w.file}: no provenance.tsv row`);
      continue;
    }
    if (!ALLOWED_LICENSES.has(meta.license)) {
      failures.push(`${family}/${w.file}: license "${meta.license}" not allowed`);
      continue;
    }
    if (!meta.tags.some((t) => COVERAGE_TAGS.includes(t))) {
      failures.push(`${family}/${w.file}: no coverage tag in ${meta.tags.join(";")}`);
      continue;
    }

    const dest = resolve(OUT_DIR, family, `${w.weight}-full.ttf`);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    const stat = statSync(dest);
    entries.push({
      file: `${w.weight}-full.ttf`,
      weight: w.weight,
      size: stat.size,
      sha256: sha256(dest),
      source: relative("/", src),
    });
    console.log(`copied ${family}/${w.weight}-full.ttf (${meta.license}, ${meta.tags.join(";")})`);
  }

  const destLicense = resolve(OUT_DIR, family, cfg.licenseFile);
  mkdirSync(dirname(destLicense), { recursive: true });
  copyFileSync(licenseSrc, destLicense);
  const licenseFiles = [cfg.licenseFile];

  // GPL families: LICENSE.txt references the full GPL text — copy it alongside
  if (cfg.gplText) {
    const gplSrc = resolve(FORK_ROOT, cfg.gplText);
    if (!existsSync(gplSrc)) {
      failures.push(`${family}: GPL text missing at ${cfg.gplText}`);
      continue;
    }
    const destGpl = resolve(OUT_DIR, family, "GNU-GPL.txt");
    copyFileSync(gplSrc, destGpl);
    licenseFiles.push("GNU-GPL.txt");
  }

  manifest.families.push({
    family,
    category: cfg.category,
    cantillation: cfg.category === "cantillation",
    license: licenseFiles,
    source: cfg.licenseSource,
    files: entries,
  });
}

if (failures.length) {
  console.error("provenance gate failed:\n  " + failures.join("\n  "));
  process.exit(1);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`wrote ${MANIFEST}: ${manifest.families.length} families, ${manifest.families.reduce((n, f) => n + f.files.length, 0)} files`);
