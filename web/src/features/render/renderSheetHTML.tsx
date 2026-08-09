/**
 * Render pipeline: mount the same `<SheetDocument>` the live preview uses
 * off-screen, capture its already browser-paginated `[data-page]` boxes
 * as-is (real classNames, no flattening), pair it with `@/css/pdf.css` — a
 * standalone stylesheet (Tailwind scoped to just the sheet/render feature
 * tree, no site-wide theme/a11y junk, see pdf.css's own header) pulled in
 * via Vite's `?inline` import as a precompiled string — and hand Folio one
 * page per `[data-page]` div joined by explicit `page-break-before:always`
 * markers — the same joiner the fork's own `FolioRenderer.render()` uses
 * for `copies`. Each div is already sized/packed to fit exactly one
 * printed page (useSheetPagePlan's browser measurement), so Folio never
 * has to decide where a page break goes — it only has to draw what's
 * already been decided.
 *
 * Folio's CSS engine has no `var()` support at all, so every custom
 * property pdf.css's rules reference (the `--izkor-*` ones, set inline by
 * step-5-review.tsx from the live SheetLayout) is resolved to its literal
 * value via `getComputedStyle` on the actual captured `[data-page]`
 * element before handing the CSS to Folio. `box-shadow` declarations are
 * also stripped — `div[data-page]`'s shadow is a screen-only "floating
 * page" affordance (nothing casts a shadow on a real printed page) and was
 * a confirmed Folio rendering gap in testing. Fonts are embedded as base64
 * data URIs since Folio has no ability to resolve a relative `/fonts/...`
 * URL itself in the browser (`fontBaseDir` in folio.d.ts is Node-only) —
 * the data URIs themselves come from `loadFontFaceData` (fonts.ts), which
 * lazy-loads a per-font module precomputed at build time by
 * vite-plugins/sheet-fonts.ts, rather than fetching + base64-encoding the
 * font bytes on every render. pdf.css's own `@font-face` rules (pointing at
 * `/fonts/...`, correct for the live preview) are stripped for the same
 * reason and superseded entirely by the embedded ones.
 */

import { createRoot } from 'react-dom/client'

import { A11Y_CLASS_PREFIX } from '@/features/a11y/preferences'
import { fontDef, loadFontFaceData } from '@/features/sheet/fonts'
import { SheetDocument } from '@/features/sheet/sheet-document'
import pdfCss from '@/css/pdf.css?inline'
import type { SheetBlock } from '@/features/sheet/content'
import type { SheetFontId, SheetLayout, SheetSettings } from '@/features/sheet/layout'

export interface RenderSheetOptions {
  content: SheetBlock[]
  layout: SheetLayout
  settings: SheetSettings
  pdfTitle?: string
}

/**
 * 3 frames with a 16ms timer shim so background tabs still advance.
 *
 * That shim used to be `setTimeout(() => requestAnimationFrame(resolve),
 * 16)` — the `setTimeout` was meant to keep this ticking on a backgrounded
 * tab, but Chrome (and others) fully suspend `requestAnimationFrame`
 * callbacks for a hidden document rather than merely throttling them, so the
 * inner rAF still never fires and the whole render hangs forever. That's no
 * longer just a hypothetical: this render can now kick off automatically
 * while the user is on a different tab (step 5's auto PDF regeneration),
 * not only from an explicit, always-focused download click. `document.hidden`
 * skips rAF entirely in that case and just waits out the timer.
 */
async function waitFrames(count: number): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => {
      if (document.hidden) {
        setTimeout(resolve, 16)
        return
      }
      setTimeout(() => requestAnimationFrame(() => resolve()), 16)
    })
  }
}

function forceReflow(element: HTMLElement): void {
  void element.offsetHeight
}

/**
 * `index.css` has a real `@media print { ... }` block resetting a11y toggle
 * classes (large text, high contrast, mono, etc.) so they don't leak into a
 * printed/PDF copy — but that media query only ever matches during an
 * actual browser print action. This capture runs in an ordinary tab, so the
 * `@media print` rule never applies here even though its intent — a11y
 * settings must not leak into the PDF — still does. This reproduces that
 * intent directly: strip every a11y-* class from <html> before rendering,
 * restore the user's actual preference afterward.
 */
async function withA11yClassesSuppressed<T>(fn: () => Promise<T>): Promise<T> {
  const root = document.documentElement
  const removed = Array.from(root.classList).filter((name) => name.startsWith(A11Y_CLASS_PREFIX))
  root.classList.remove(...removed)
  try {
    return await fn()
  } finally {
    root.classList.add(...removed)
  }
}

/** Screen-only "floating page" shadow on `div[data-page]` — meaningless for a printed page and a confirmed Folio corruption source. */
function stripBoxShadow(css: string): string {
  return css.replace(/box-shadow\s*:[^;]+;/gi, '')
}

/**
 * `pdf.css` (the flattened Tailwind output) still carries the sheet-fonts.ts
 * `@font-face` rules pointing at `url('/fonts/...')` — correct for the live
 * preview, useless here since the Folio worker has no origin to resolve a
 * relative URL against and no `fetchURL` hook is wired up. Those rules are
 * fully superseded by `fontFacesFor`'s base64-embedded ones, which are
 * prepended to the final stylesheet, so the relative-URL originals are only
 * dead weight (best case) or a conflicting duplicate declaration Folio
 * resolves unpredictably (worst case) — strip them outright.
 */
function stripRelativeUrlFontFaces(css: string): string {
  return css.replace(/@font-face\s*\{[^}]*\}/gi, (rule) => (/url\(['"]?\/fonts\//i.test(rule) ? '' : rule))
}

const CSS_VAR_USAGE = /var\((--[a-z0-9-]+)\s*(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/gi

/**
 * Inlines every `var(--*, fallback)` usage to its literal value — Folio has
 * no `var()` support at all. `sourceEl` must be a mounted element carrying
 * the real cascade (the captured `[data-page]` div works: it has the
 * `--izkor-*` vars set inline by step-5-review.tsx), so `getComputedStyle`
 * resolves multi-level `var(--a, var(--b))` chains to their terminal value
 * in one pass — no manual chain-walking needed.
 */
function resolveCssVars(css: string, sourceEl: Element): string {
  const computed = getComputedStyle(sourceEl)
  const cache = new Map<string, string>()
  return css.replace(CSS_VAR_USAGE, (full: string, name: string, fallback?: string) => {
    if (!cache.has(name)) cache.set(name, computed.getPropertyValue(name).trim())
    const resolved = cache.get(name)
    return resolved || fallback?.trim() || full
  })
}

/** @font-face rules (already base64-embedded) for exactly the fonts this render uses (not the whole registry). */
async function fontFacesFor(fontIds: SheetFontId[]): Promise<string> {
  const seen = new Set<SheetFontId>()
  const rules: string[] = []
  for (const id of fontIds) {
    if (seen.has(id)) continue
    seen.add(id)
    const def = fontDef(id)
    const dataByFile = await loadFontFaceData(id)
    for (const f of def.files) {
      const src = dataByFile[f.file]
      if (!src) throw new Error(`no embedded font data for ${def.cssFamily} (${f.file})`)
      rules.push(
        `@font-face{font-family:'${def.cssFamily}';font-style:${f.style};` +
          `font-weight:${f.weight};src:url('${src}') format('truetype');}`,
      )
    }
  }
  return rules.join('\n')
}

/**
 * Folio's CSS tokenizer cannot handle family names with spaces (they appear
 * unquoted in serialized inline styles) — the family is renamed to its
 * space-free form in the captured CSS and in the page markup, and the
 * @font-face family is renamed to match.
 */
function compactFontFamily(cssOrHtml: string, fontFamily: string, pdfFamily: string): string {
  return cssOrHtml
    .replaceAll(`"${fontFamily}"`, `"${pdfFamily}"`)
    .replaceAll(`'${fontFamily}'`, `'${pdfFamily}'`)
    .replaceAll(`font-family: ${fontFamily}`, `font-family: ${pdfFamily}`)
    .replaceAll(`font-family:${fontFamily}`, `font-family:${pdfFamily}`)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const PAGE_BREAK = '<div style="page-break-before:always"></div>'

/**
 * Render the sheet's content off-screen and return the standalone HTML
 * document (one `<div data-page>` per already-paginated page, real compiled
 * CSS, base64-embedded fonts) for Folio to draw.
 */
export async function renderSheetHTML(options: RenderSheetOptions): Promise<string> {
  const { content, layout, settings, pdfTitle } = options

  const host = document.createElement('div')
  host.setAttribute('data-izkor-capture', '')
  host.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:2147483647;'
  document.body.appendChild(host)

  const root = createRoot(host)
  try {
    return await withA11yClassesSuppressed(async () => {
      root.render(<SheetDocument content={content} layout={layout} settings={settings} />)
      if (document.fonts?.ready) await document.fonts.ready
      forceReflow(host)
      await waitFrames(3)

      const pages = Array.from(host.querySelectorAll('[data-page]')).filter(
        (page) => !page.closest('[data-sheet-measure]'),
      )
      const pdfBody = pages.map((page) => page.outerHTML).join(PAGE_BREAK)

      // Exactly the fonts this render uses — the resolved per-element fonts,
      // deduped (typically just the ones the user overrode + the global).
      const familiesInUse = [...new Set(Object.values(settings.fonts))]

      let compiledCss = stripBoxShadow(pdfCss)
      compiledCss = stripRelativeUrlFontFaces(compiledCss)
      compiledCss = resolveCssVars(compiledCss, pages[0] ?? host)

      const embeddedFontFaces = await fontFacesFor(familiesInUse)
      let finalCss = embeddedFontFaces + '\n' + (layout.page.pageCss ?? '') + '\n' + compiledCss

      let pdfBodyHtml = pdfBody
      for (const fontId of new Set(familiesInUse)) {
        const family = fontDef(fontId).cssFamily
        const pdfFamily = family.replaceAll(/\s+/g, '')
        finalCss = compactFontFamily(finalCss, family, pdfFamily)
        pdfBodyHtml = compactFontFamily(pdfBodyHtml, family, pdfFamily)
      }

      const title = pdfTitle ? `<title>${escapeHtml(pdfTitle)}</title>\n` : ''
      const html =
        '<!DOCTYPE html>\n<html dir="rtl" lang="he">\n<head>\n' +
        '<meta charset="UTF-8">\n' +
        title +
        '<style>\n' +
        finalCss +
        '\nbody{margin:0;padding:0;}\n' +
        '</style>\n</head>\n<body>\n' +
        pdfBodyHtml +
        '\n</body>\n</html>'

      // Dev-only hook for inspecting exactly what Folio receives — open it
      // as a standalone .html file to confirm it renders correctly with no
      // dependency on the app's stylesheets (same convention as
      // folio-client.ts's `__folioClient`).
      if (import.meta.env.DEV) {
        ;(globalThis as { __lastSheetHtml?: string }).__lastSheetHtml = html
      }
      return html
    })
  } finally {
    root.unmount()
    host.remove()
  }
}
