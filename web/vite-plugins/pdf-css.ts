/**
 * Builds src/css/pdf.css (gitignored) from src/css/_pdf.css.
 *
 * Folio's CSS engine doesn't support nested selectors / native CSS nesting
 * the way a browser does (see renderSheetHTML.tsx's var()-inlining note for
 * another Folio CSS-engine gap), so the Tailwind-compiled output — which
 * Tailwind v4 emits using native nesting/@layer — has to be flattened before
 * it's usable. Pipeline, run as a single generate() step:
 *
 *   1. `tailwindcss -i _pdf.css -o pdf.css`   — resolves @import/@source/@apply
 *   2. `lightningcss --targets "chrome 100" pdf.css -o pdf.css` — flattens
 *      nesting/@layer down to plain flat rules Folio can parse
 *
 * Runs once at buildStart (so `vite build` always has a fresh pdf.css to
 * bundle) and again on every dev-server change to _pdf.css, the files it
 * @imports (preview.css, generated/sheet-fonts.css), or anything under the
 * feature trees its `@source` directives scan (features/sheet,
 * features/render) — all of which can change what Tailwind emits.
 */
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import type { Plugin } from 'vite'

const WATCH_PREFIXES = [
  'src/css/_pdf.css',
  'src/css/preview.css',
  'src/css/generated/sheet-fonts.css',
  'src/features/sheet',
  'src/features/render',
]

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
