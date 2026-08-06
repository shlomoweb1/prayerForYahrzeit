/**
 * Canonical "what CSS actually exists" data, sourced from the `mdn-data`
 * npm package (MDN's own machine-readable CSS property registry — the same
 * data that backs MDN's compat tables and browser-compat-data). This is
 * versioned like any other dependency (`npm update mdn-data`), so the
 * property list this toolkit checks against stays current without anyone
 * hand-maintaining a list.
 *
 * `printable` classification: go-html-to-pdf/Folio renders a *single,
 * static snapshot* of already-final HTML — there is no user interaction,
 * no elapsed time, no scrolling. A CSS property that only ever affects
 * behavior over time or in response to interaction (animation, transition,
 * scroll-snap, cursor, hover-driven will-change hints, etc.) can never
 * possibly matter to that snapshot, whether or not Folio implements it —
 * so it's out of scope for "what should Folio support" and would just be
 * noise in a gap report.
 *
 * MDN's own `groups`/`media` fields get most of the way there but aren't
 * fine-grained enough on their own (e.g. `cursor` and `user-select` are
 * both tagged `media: visual`, same as `color`, despite being purely
 * interaction-state properties with zero effect on a static render) — the
 * small EXCLUDED_PROPERTIES list below plugs that gap. Extend either list
 * below if a newly-added CSS property/module turns out to be temporal or
 * interaction-only; nothing else about this file should need to change as
 * `mdn-data` is upgraded.
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** Whole CSS modules that are entirely about behavior-over-time or user interaction — no exceptions worth keeping. */
export const EXCLUDED_GROUPS = new Set([
  'CSS Animations',
  'CSS Transitions',
  'CSS Scroll Snap',
  'CSS Overscroll Behavior',
  'CSS Scroll Anchoring',
  'Scroll-driven Animations',
  'CSS View Transitions',
  'Motion Path',
  'Pointer Events',
  'CSS Speech',
  'CSS Will Change',
  'CSS Anchor Positioning',
  'CSS Scrollbars Styling',
  // Shared with selectors/functions checks (selectors-atrules-functions-matrix.mjs):
  // env() reflects live viewport/device state (notch insets etc.), meaningless
  // for an already-rendered fixed-size PDF page; Houdini paint() requires a
  // registered JS worklet, which never runs in Folio's converter.
  'CSS Environment Variables',
  'CSS Houdini',
  // Legacy vendor-prefixed cruft, superseded by standard equivalents
  // already covered under their real module (flexbox, box-sizing, etc.) —
  // keeping these would just be ~130 near-duplicate prefixed properties.
  'Microsoft Extensions',
  'Mozilla Extensions',
  'WebKit Extensions',
  // Not applicable to an HTML document renderer.
  'MathML',
])

/** Individually excluded: visually-tagged by MDN but only ever expressed through interaction (hover, focus, active editing, pointer input) — never present in a static snapshot. */
export const EXCLUDED_PROPERTIES = new Set([
  'cursor',
  'user-select',
  'resize',
  'caret-color',
  'touch-action',
])

export function isPrintable(name, def) {
  if (EXCLUDED_PROPERTIES.has(name)) return false
  if (def.status === 'obsolete') return false
  if ((def.groups || []).some((g) => EXCLUDED_GROUPS.has(g))) return false
  return true
}

/** name -> {groups, status, media, mdn_url, printable} for every property mdn-data knows about. */
export function loadMdnProperties() {
  const raw = require('mdn-data/css/properties.json')
  const byName = new Map()
  for (const [name, def] of Object.entries(raw)) {
    if (name === '--*') continue // placeholder entry for "any custom property", not a real one
    byName.set(name, { ...def, printable: isPrintable(name, def) })
  }
  return byName
}
