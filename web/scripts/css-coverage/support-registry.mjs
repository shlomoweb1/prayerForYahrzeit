/**
 * Parses go-html-to-pdf's generated docs/CSS_SUPPORT.md into a lookup table.
 * That file is regenerated from html/css_props.go by `go generate
 * ./html/...` — the single source of truth for what Folio's HTML converter
 * actually applies. Nothing in this toolkit hand-maintains its own copy.
 */
import { readFileSync } from 'node:fs'

// `content` is intentionally excluded from the css_props.go registry — it's
// intercepted separately in pseudo-element generation (parsePseudoContent),
// not a registry gap. See that file's own comment.
export const SPECIAL_CASES = {
  content: {
    status: 'supported-special-case',
    note: 'Handled by pseudo-element generation (::before/::after content), not the property registry. Only meaningful on ::before/::after.',
  },
}

export function parseSupportRegistry(mdPath) {
  const md = readFileSync(mdPath, 'utf8')
  const lines = md.split('\n')
  const byName = new Map()
  const aliasToCanonical = new Map()
  let category = null
  for (const line of lines) {
    const heading = line.match(/^## (.+)$/)
    if (heading) {
      category = heading[1].trim()
      continue
    }
    if (category === 'Value-form glossary') continue

    // The "Logical Properties" section (converter_logical.go, dispatched
    // outside the cssProperties registry — see support-registry.mjs's own
    // module doc) uses a 3-column table with every property name for a row
    // packed into one cell (e.g. "`margin-block-start`, `margin-block-end`"),
    // not the registry's one-name-per-row 4-column format below. Every
    // backtick-quoted token in such a row is an independently supported
    // canonical property name.
    if (category === 'Logical Properties') {
      if (!line.startsWith('|') || line.startsWith('| Property') || line.startsWith('|---')) continue
      for (const m of line.matchAll(/`([a-z-]+)`/g)) {
        byName.set(m[1], { category, aliases: [], values: '', notes: '' })
      }
      continue
    }

    // Per-property rows look like: | `name` | `alias1`, `alias2` or — | ... | ... |
    const row = line.match(/^\|\s*`([a-zA-Z-]+)`\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/)
    if (!row) continue
    const [, name, aliasesRaw, valuesRaw, notesRaw] = row
    const aliases =
      aliasesRaw === '—' ? [] : Array.from(aliasesRaw.matchAll(/`([^`]+)`/g)).map((m) => m[1])
    byName.set(name, {
      category,
      aliases,
      values: valuesRaw,
      notes: notesRaw === '—' ? '' : notesRaw,
    })
    for (const alias of aliases) aliasToCanonical.set(alias, name)
  }
  return { byName, aliasToCanonical }
}

export function canonicalize(prop, registry) {
  if (registry.byName.has(prop)) return prop
  if (registry.aliasToCanonical.has(prop)) return registry.aliasToCanonical.get(prop)
  return null
}

export function classify(prop, registry) {
  if (SPECIAL_CASES[prop]) return SPECIAL_CASES[prop]
  const canonical = canonicalize(prop, registry)
  if (canonical) {
    const entry = registry.byName.get(canonical)
    return {
      status: canonical === prop ? 'supported' : 'supported-alias',
      canonical,
      category: entry.category,
      notes: entry.notes,
    }
  }
  return { status: 'unsupported' }
}
