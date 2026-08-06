#!/usr/bin/env node
/**
 * css-support-matrix.mjs answers "which CSS *properties* does Folio
 * silently drop" — but a property can be fully supported and still never
 * take effect for two other reasons:
 *
 *   1. The SELECTOR that would have applied it doesn't match anything,
 *      because Folio's selector engine doesn't understand it (e.g. `:has()`
 *      — the whole rule silently never fires, even though every property
 *      inside it is otherwise fine).
 *   2. A FUNCTION inside the value fails to parse (e.g. `color-mix()`),
 *      dropping that whole declaration even for a supported property.
 *   3. An AT-RULE wrapping the block isn't understood (e.g. `@import`),
 *      dropping everything inside it.
 *
 * This script closes that gap using the same method as
 * css-support-matrix.mjs: MDN's own registries (`mdn-data`'s
 * selectors.json / at-rules.json / functions.json) as the canonical "what
 * exists" list, filtered to what's printable-relevant (see
 * mdn-css-properties.mjs's isPrintable — same reasoning, plus a selector-
 * specific PRINTABLE exclusion below for interaction/shadow-DOM/media-
 * playback pseudo-classes that have no equivalent in a static document).
 *
 * Folio's side is NOT auto-derived from a generated doc the way properties
 * are (go-html-to-pdf has no equivalent of css_props.go's registry for
 * selectors/at-rules/functions) — it's transcribed here from
 * go-html-to-pdf/html/doc.go's own "Selectors:"/"@-rules:"/"Values:"
 * package-doc summary (the closest thing to an authoritative list) plus
 * corroborating grep hits in html/css_selectors.go, html/css.go,
 * html/converter_style_parsers.go, html/grid.go, html/page.go. If Folio's
 * doc.go summary is ever updated, this list needs a manual re-sync —
 * flagged here so a future agent knows to check doc.go first.
 */
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { EXCLUDED_GROUPS } from './mdn-css-properties.mjs'

const require = createRequire(import.meta.url)

function parseArgs(argv) {
  const args = { json: null }
  const rest = [...argv]
  while (rest.length) {
    const flag = rest.shift()
    if (flag === '--json') args.json = rest.shift()
    else throw new Error(`unknown arg: ${flag}`)
  }
  return args
}

// --- Folio's actual support, transcribed from go-html-to-pdf/html/doc.go ---
// (package doc comment, "Selectors:"/"@-rules:"/"Values:" sections) plus
// html/css_selectors.go (dispatch cases), html/grid.go (repeat/minmax),
// html/page.go (@page margin boxes), html/converter_style_parsers.go
// (calc/min/max/clamp). Basic structural selectors (type, .class, #id, *,
// combinators, [attr] forms) are not individually listed in MDN's
// selectors.json as discrete entries the way pseudo-classes are, so they're
// not part of this matrix — doc.go confirms all of them are supported.
const FOLIO_SELECTORS = new Set([
  ':first-child', ':last-child', ':nth-child()', ':nth-of-type()',
  ':nth-last-child()', ':nth-last-of-type()', ':first-of-type', ':last-of-type',
  ':root', ':not()', ':is()', ':where()', ':empty', ':dir()',
  '::before', '::after', '::marker', '::placeholder',
])

const FOLIO_AT_RULES = new Set(['@page', '@font-face', '@media', '@supports'])

// calc/min/max/clamp confirmed in converter_style_parsers.go; color functions
// and gradients confirmed in css_props.go's `color`/`background-image`
// registry entries; var() in converter_style.go; counter()/counters() in
// converter_style.go + doc.go ("CSS counters via counter-reset,
// counter-increment, counter()."); attr() in bookmark.go (bookmark-label
// only, not general content — see note below); transform functions in
// layout/transform_test.go + css_props.go's `transform` entry; repeat()/
// minmax() in grid.go.
const FOLIO_FUNCTIONS = new Set([
  'calc()', 'min()', 'max()', 'clamp()', 'var()',
  'rgb()', 'rgba()', 'hsl()', 'hsla()',
  'url()',
  'linear-gradient()', 'repeating-linear-gradient()', 'radial-gradient()', 'repeating-radial-gradient()',
  'counter()', 'counters()',
  'translate()', 'translateX()', 'translateY()', 'rotate()', 'scale()', 'scaleX()', 'scaleY()', 'skew()', 'skewX()', 'skewY()',
  'repeat()', 'minmax()',
])
// Explicitly NOT supported despite appearing in Go source (parsed only to
// be rejected) — see css_props.go's `color` registry entry Notes field:
// "sRGB only. oklch() and color-mix() are not supported."
const FOLIO_EXPLICITLY_UNSUPPORTED_FUNCTIONS = new Set(['oklch()', 'oklab()', 'color-mix()'])

// attr() is real in Folio, but scoped: bookmark.go's resolveBookmarkLabel
// implements it only for the Folio-specific PDF `bookmark-label` property.
// The general CSS path — `content: attr(data-x)` on ::before/::after —
// goes through converter_style.go's resolveContentValue, which has no
// attr() branch at all (only quoted strings, counter(), counters()). A
// very common real-world ::before pattern is silently dropped.
const FOLIO_PARTIALLY_SUPPORTED_FUNCTIONS = {
  'attr()': 'supported only for the `bookmark-label` PDF property, not in standard `content` values',
}

// Interaction-state, media-playback, shadow-DOM, or view-transition
// pseudo-classes/elements — structurally impossible to express in a
// captured, already-rendered static HTML snapshot (no history, no hover,
// no shadow DOM in Folio's plain-HTML converter, no elapsed time). Kept
// separate from EXCLUDED_GROUPS since MDN tags nearly all pseudo-classes
// under the single generic "Selectors" group, too coarse to filter by.
const NON_PRINTABLE_SELECTORS = new Set([
  ':active', ':hover', ':focus', ':focus-visible', ':focus-within',
  ':visited', ':target', ':target-current', ':target-within', ':local-link', ':current', ':past', ':future',
  ':host', ':host()', ':host-context()', ':has-slotted', '::slotted()', '::part()', ':state()', '::highlight()',
  ':active-view-transition', ':active-view-transition-type()',
  ':muted', ':paused', ':picture-in-picture', ':playing', ':seeking', ':stalled', ':volume-locked', ':buffering',
  ':popover-open', ':modal', ':autofill', ':indeterminate', ':xr-overlay', ':scope', ':fullscreen',
  '::view-transition', '::view-transition-group()', '::view-transition-image-pair()', '::view-transition-new()', '::view-transition-old()',
  '::cue', '::cue()', '::cue-region', '::cue-region()', // WebVTT captions — video-only
  '::picker-icon', '::picker()', '::checkmark', // new <select> customization, interaction-only widget parts
])

function isPrintableSelector(name) {
  if (NON_PRINTABLE_SELECTORS.has(name)) return false
  if (/^::-(ms|moz|webkit)-/.test(name)) return false // legacy vendor form-control internals
  return true
}

const NON_PRINTABLE_AT_RULES = new Set([
  '@keyframes', '@starting-style', '@view-transition', '@position-try', '@document',
])

const args = parseArgs(process.argv.slice(2))

function buildSection(mdnFile, printableFilter, folioSet) {
  const raw = require(mdnFile)
  const rows = []
  for (const [name, def] of Object.entries(raw)) {
    if (!name.startsWith(':') && !name.startsWith('@') && !name.endsWith('()') && !/^[a-z-]+\(\)$/.test(name)) {
      // Skip MDN's non-leaf grouping entries (e.g. "Type selectors", "Pseudo-classes")
      if (!(mdnFile.includes('at-rules') || mdnFile.includes('selectors'))) {
        // functions.json has no such grouping entries; only relevant for selectors/at-rules
      } else {
        continue
      }
    }
    const groupExcluded = (def.groups || []).some((g) => EXCLUDED_GROUPS.has(g))
    const printable = printableFilter(name) && def.status !== 'obsolete' && !groupExcluded
    rows.push({ name, printable, groups: def.groups ?? [], status: def.status, supported: folioSet.has(name) })
  }
  return rows
}

const selectorRows = buildSection(
  'mdn-data/css/selectors.json',
  isPrintableSelector,
  FOLIO_SELECTORS,
).filter((r) => r.name.startsWith(':'))

const atRuleRows = buildSection(
  'mdn-data/css/at-rules.json',
  (name) => !NON_PRINTABLE_AT_RULES.has(name),
  FOLIO_AT_RULES,
)

const functionRows = buildSection(
  'mdn-data/css/functions.json',
  () => true,
  FOLIO_FUNCTIONS,
).map((r) => ({
  ...r,
  explicitlyUnsupported: FOLIO_EXPLICITLY_UNSUPPORTED_FUNCTIONS.has(r.name),
  partialNote: FOLIO_PARTIALLY_SUPPORTED_FUNCTIONS[r.name],
}))

function report(label, rows) {
  const printable = rows.filter((r) => r.printable)
  const gaps = printable.filter((r) => !r.supported)
  console.log(`\n${label}: ${rows.length} known, ${printable.length} printable-relevant, ${gaps.length} NOT supported by Folio`)
  for (const g of gaps.sort((a, b) => a.name.localeCompare(b.name))) {
    const note = g.explicitlyUnsupported
      ? '  (parsed then explicitly rejected — see css_props.go notes)'
      : g.partialNote
        ? `  (${g.partialNote})`
        : ''
    console.log(`  - ${g.name}${note}`)
  }
}

console.log(`Selectors / at-rules / functions vs. Folio (go-html-to-pdf/html/doc.go)`)
report('Pseudo-classes & pseudo-elements', selectorRows)
report('At-rules', atRuleRows)
report('Value functions', functionRows)

if (args.json) {
  writeFileSync(args.json, JSON.stringify({ selectorRows, atRuleRows, functionRows }, null, 2))
  console.log(`\nFull report written to ${args.json}`)
}
