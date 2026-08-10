/**
 * Builds src/css/pdf.css (gitignored) from src/css/_pdf.css.
 *
 * Folio's CSS engine doesn't support nested selectors / native CSS nesting
 * the way a browser does (see renderSheetHTML.tsx's var()-inlining note for
 * another Folio CSS-engine gap), so the Tailwind-compiled output - which
 * Tailwind v4 emits using native nesting/@layer - has to be flattened before
 * it's usable. Pipeline, run as a single generate() step:
 *
 *   1. `tailwindcss -i _pdf.css -o pdf.css`   - resolves @import/@source/@apply
 *   2. `lightningcss --targets "chrome 100" pdf.css -o pdf.css` - flattens
 *      nesting/@layer down to plain flat rules Folio can parse
 *
 * Runs once at buildStart (so `vite build` always has a fresh pdf.css to
 * bundle) and again on every dev-server change to _pdf.css, the files it
 * @imports (preview.css, generated/sheet-fonts.css), or anything under the
 * feature trees its `@source` directives scan (features/sheet,
 * features/render) - all of which can change what Tailwind emits.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const WATCH_PREFIXES = [
  'src/css/_pdf.css',
  'src/css/preview.css',
  'src/css/generated/sheet-fonts.css',
  'src/features/sheet',
  'src/features/render',
]

/**
 * Folio's CSS engine (html/properties.go `parseDisplay`) only recognizes
 * these `display` values - anything else silently falls back to `block`.
 * That's not a parse error, so a typo'd `inline-flex` doesn't fail loudly:
 * it quietly turns a small inline badge into a full-width block, which then
 * corrupts pagination (page-break math is driven by measured element
 * heights). Caught this the hard way once already - this check exists so
 * the next one fails the build instead of a printed PDF.
 *
 * `inline-flex`/`inline-grid` were added to Folio's own whitelist (and given
 * real flex/grid inner layout, not just inline-participation) in the
 * go-html-to-pdf fork's `dev` branch - keep this list in sync with
 * `html/properties.go`'s `parseDisplay` if that ever changes again.
 */
const FOLIO_DISPLAY_VALUES = new Set([
  'block',
  'inline',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'none',
  'table',
  'table-row',
  'table-cell',
  'inline-block',
  'list-item',
])

/**
 * Drops `@layer <name> { ... }` blocks (brace-depth aware, no nested-rule
 * support needed since pdf.css is already flattened). Folio discards `@`
 * rules other than `@font-face`/`@page`/`@supports`/`@media print` wholesale
 * (html/css.go), and virtually all of Tailwind's own reset/utility output
 * lives inside `@layer` - without stripping it first, this check would flag
 * dozens of display values in CSS Folio never actually sees.
 */
function stripLayerBlocks(css: string): string {
  let out = ''
  let i = 0
  while (i < css.length) {
    const at = css.indexOf('@layer', i)
    if (at < 0) {
      out += css.slice(i)
      break
    }
    out += css.slice(i, at)
    const open = css.indexOf('{', at)
    const semi = css.indexOf(';', at)
    if (open < 0) {
      out += css.slice(at)
      break
    }
    if (semi >= 0 && semi < open) {
      // bare `@layer components;` statement, no block to skip.
      i = semi + 1
      continue
    }
    let depth = 1
    let j = open + 1
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    i = j
  }
  return out
}

/**
 * Heuristic, not a full CSS parser: matches `selector { ...no-nested-braces... }`
 * pairs, which is safe here because pdf.css is post-flatten (no nesting) and
 * `@layer` - the one wrapper that would confuse a brace-naive scan - was
 * already stripped above. Throws with every offending selector at once
 * rather than one-at-a-time, since these tend to come in batches.
 */
function assertFolioCompatibleDisplay(css: string, filePath: string): void {
  const scoped = stripLayerBlocks(css)
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g
  const violations: string[] = []
  let match: RegExpExecArray | null
  while ((match = ruleRe.exec(scoped))) {
    const selector = match[1].trim()
    const displayMatch = match[2].match(/(?:^|;)\s*display\s*:\s*([a-z-]+)/i)
    if (displayMatch && !FOLIO_DISPLAY_VALUES.has(displayMatch[1].toLowerCase())) {
      violations.push(`  ${selector} { display: ${displayMatch[1]} }`)
    }
  }
  if (violations.length > 0) {
    throw new Error(
      `${filePath}: display value(s) not supported by Folio's CSS engine - ` +
        `Folio only understands ${[...FOLIO_DISPLAY_VALUES].join(', ')}; anything ` +
        `else silently becomes "block" and corrupts pagination. Fix:\n${violations.join('\n')}`,
    )
  }
}

export function pdfCss(): Plugin {
  let root: string
  let srcIn: string
  let out: string
  let tailwindBin: string
  let lightningcssBin: string
  let generating = false
  let pendingRerun = false

  const generate = () => {
    if (generating) {
      pendingRerun = true
      return
    }
    generating = true
    try {
      execFileSync(tailwindBin, ['-i', srcIn, '-o', out], { stdio: 'inherit' })
      execFileSync(lightningcssBin, ['--targets', 'chrome 100', out, '-o', out], {
        stdio: 'inherit',
      })
      assertFolioCompatibleDisplay(fs.readFileSync(out, 'utf-8'), path.relative(root, out))
    } finally {
      generating = false
      if (pendingRerun) {
        pendingRerun = false
        generate()
      }
    }
  }

  return {
    name: 'izkor:pdf-css',
    configResolved(config) {
      root = config.root
      srcIn = path.join(root, 'src/css/_pdf.css')
      out = path.join(root, 'src/css/pdf.css')
      tailwindBin = path.join(root, 'node_modules/.bin/tailwindcss')
      lightningcssBin = path.join(root, 'node_modules/.bin/lightningcss')
    },
    buildStart() {
      generate()
    },
    handleHotUpdate(ctx) {
       const rel = path.relative(root, ctx.file);

      if (
        WATCH_PREFIXES.some(
          prefix => rel === prefix || rel.startsWith(prefix + path.sep)
        )
      ) {
        generate()
      }
    },
  }
}
