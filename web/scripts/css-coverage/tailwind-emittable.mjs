/**
 * Tailwind v4's utility-generation logic lives in bundled JS
 * (node_modules/tailwindcss/dist/*.mjs), not a human-readable source tree -
 * there is no JSON/API export of "every property we might emit". But the
 * bundle is minified, not obfuscated: every literal CSS property name the
 * engine can produce still appears verbatim as a quoted string somewhere in
 * it (property setters, `@utility` definitions, etc.). Extracting every
 * kebab-case string literal from the bundle produces a superset containing
 * both real CSS properties and unrelated tokens (class-name fragments like
 * "inline-flex", keyword values, internal identifiers); intersecting that
 * superset against MDN's own CSS property registry (`mdn-data`) filters it
 * down to exactly the CSS properties Tailwind can genuinely emit - no
 * hand-maintained property list, no dependency on Tailwind publishing one.
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

/** Set<string> of every CSS property name Tailwind's utility engine (JIT bundle) plus its static base CSS (preflight/theme/index) can emit, intersected against `mdnPropertyNames`. */
export function tailwindEmittableProperties(tailwindDir, mdnPropertyNames) {
  const tokens = new Set()
  const distDir = path.join(tailwindDir, 'dist')
  const jsFiles = readdirSync(distDir)
    .filter((f) => f.endsWith('.mjs') || f.endsWith('.js'))
    .map((f) => path.join(distDir, f))
  const cssFiles = readdirSync(tailwindDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => path.join(tailwindDir, f))

  const tokenPattern = /"([a-z][a-z0-9]*(?:-[a-z0-9]+){0,4})"/g
  for (const file of jsFiles) {
    const src = readFileSync(file, 'utf8')
    for (const m of src.matchAll(tokenPattern)) tokens.add(m[1])
  }

  // Static CSS files (preflight.css, theme.css, index.css) are always-real
  // CSS, not JIT-generated - parse declared property names directly rather
  // than relying on the string-literal heuristic, since these aren't
  // produced by the same on-demand utility engine.
  const declPattern = /([a-zA-Z-]+)\s*:\s*[^;{}]+;/g
  for (const file of cssFiles) {
    const src = readFileSync(file, 'utf8')
    for (const m of src.matchAll(declPattern)) {
      if (m[1].startsWith('--')) continue
      tokens.add(m[1].toLowerCase())
    }
  }

  return new Set(Array.from(tokens).filter((t) => mdnPropertyNames.has(t)))
}
