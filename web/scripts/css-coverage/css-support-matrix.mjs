#!/usr/bin/env node
/**
 * The durable checklist: every CSS property that can matter to a static
 * HTML->PDF render (per MDN's own registry, `mdn-data`, filtered to
 * "printable" - see mdn-css-properties.mjs for what that excludes and why),
 * cross-referenced against Folio's declared support
 * (go-html-to-pdf/docs/CSS_SUPPORT.md) and flagged for whether this
 * project's actual toolchain (Tailwind v4) can even emit it.
 *
 * This is intentionally decoupled from any one document or bug: rerun it
 * after `npm update mdn-data` (new CSS lands in browsers) or after Folio's
 * registry changes (`go generate ./html/...` in go-html-to-pdf), and it
 * re-derives the gap list from scratch - nobody has to remember to update a
 * hand-written list of "things Folio is missing".
 *
 * Priority tiers in the output:
 *   1. printable + Tailwind can emit it + Folio doesn't understand it
 *      -> real, live risk: a class in this project's own stylesheets could
 *      silently no-op in the PDF right now or after any future style change.
 *   2. printable + Folio doesn't understand it, Tailwind can't emit it
 *      -> only a risk if hand-authored CSS (not a Tailwind utility) ever
 *      uses it directly.
 *   3. non-printable (animation/interaction/etc.) -> correctly out of scope
 *      for a static renderer, listed only for completeness/audit.
 *
 * Usage:
 *   node css-support-matrix.mjs [--tailwind-dir <path>] [--support <CSS_SUPPORT.md>] [--json out.json]
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadMdnProperties } from './mdn-css-properties.mjs'
import { tailwindEmittableProperties } from './tailwind-emittable.mjs'
import { parseSupportRegistry, classify } from './support-registry.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_TAILWIND_DIR = path.resolve(__dirname, '../../node_modules/tailwindcss')
const DEFAULT_SUPPORT_MD = path.resolve(
  __dirname,
  '../../../../tziyun-berega/go-html-to-pdf/docs/CSS_SUPPORT.md',
)

function parseArgs(argv) {
  const args = { tailwindDir: DEFAULT_TAILWIND_DIR, support: DEFAULT_SUPPORT_MD, json: null }
  const rest = [...argv]
  while (rest.length) {
    const flag = rest.shift()
    if (flag === '--tailwind-dir') args.tailwindDir = path.resolve(rest.shift())
    else if (flag === '--support') args.support = rest.shift()
    else if (flag === '--json') args.json = rest.shift()
    else throw new Error(`unknown arg: ${flag}`)
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
const mdnProps = loadMdnProperties()
const registry = parseSupportRegistry(args.support)
const tailwindCanEmit = tailwindEmittableProperties(args.tailwindDir, new Set(mdnProps.keys()))

const rows = Array.from(mdnProps.entries()).map(([property, mdn]) => {
  const folio = classify(property, registry)
  return {
    property,
    printable: mdn.printable,
    groups: mdn.groups ?? [],
    status: mdn.status,
    mdnUrl: mdn.mdn_url,
    tailwindCanEmit: tailwindCanEmit.has(property),
    folioStatus: folio.status,
    folioCanonical: folio.canonical ?? null,
    folioNotes: folio.notes ?? folio.note ?? '',
  }
})

const tier1 = rows.filter((r) => r.printable && r.tailwindCanEmit && r.folioStatus === 'unsupported')
const tier2 = rows.filter((r) => r.printable && !r.tailwindCanEmit && r.folioStatus === 'unsupported')
const printableSupported = rows.filter((r) => r.printable && r.folioStatus !== 'unsupported')
const nonPrintable = rows.filter((r) => !r.printable)

console.log(`\nCSS support matrix - MDN registry (${rows.length} properties) x Folio x Tailwind`)
console.log(`  Printable properties (relevant to a static render): ${rows.length - nonPrintable.length}`)
console.log(`  ...recognized by Folio:                             ${printableSupported.length}`)
console.log(`  ...NOT recognized, AND this project's Tailwind build can emit them:  ${tier1.length}`)
console.log(`  ...NOT recognized, but Tailwind can't emit them (theoretical only):  ${tier2.length}`)
console.log(`  Non-printable (animation/interaction/etc., correctly out of scope): ${nonPrintable.length}`)

console.log(
  `\n=== Tier 1: live risk - used by this project's toolchain, invisible to Folio ===\n`,
)
for (const r of tier1.sort((a, b) => a.property.localeCompare(b.property))) {
  console.log(`  - ${r.property}  [${r.groups.join(', ')}]`)
}

console.log(
  `\n=== Tier 2: theoretical gap - Folio can't parse it, but nothing in this repo's Tailwind build emits it today ===\n`,
)
for (const r of tier2.sort((a, b) => a.property.localeCompare(b.property))) {
  console.log(`  - ${r.property}  [${r.groups.join(', ')}]`)
}

if (args.json) {
  writeFileSync(
    args.json,
    JSON.stringify({ tier1, tier2, printableSupported, nonPrintable }, null, 2),
  )
  console.log(`\nFull matrix written to ${args.json}`)
}
