/**
 * Render pipeline: capture the sheet DOM off-screen and wrap it into a
 * standalone HTML document for the Folio worker.
 *
 * The sheet renders exactly as the preview does (same component, same CSS),
 * so the PDF can never drift from what the user sees. The capture mounts a
 * hidden host at the target's pixel width, waits for fonts + layout stability
 * (fonts.ready -> forced reflow -> 3×16ms frames), then serializes the page
 * divs and the sheet <style> block, and wraps everything with the layout's
 * @page CSS and an RTL/Hebrew document shell.
 */

import { createRoot } from 'react-dom/client'

import { SheetDocument } from '@/features/sheet/sheet-document'
import type { SheetBlock } from '@/features/sheet/content'
import type { SheetLayout, SheetSettings } from '@/features/sheet/layout'

export interface RenderSheetOptions {
  content: SheetBlock[]
  layout: SheetLayout
  settings: SheetSettings
  pdfTitle?: string
}

/** 3 frames with a 16ms timer shim so background tabs still advance. */
async function waitFrames(count: number): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => {
      setTimeout(() => requestAnimationFrame(() => resolve()), 16)
    })
  }
}

function forceReflow(element: HTMLElement): void {
  void element.offsetHeight
}

function captureSheetStyles(styleTag: HTMLStyleElement): string {
  const sheet = styleTag.sheet
  if (!sheet) return ''
  const parts: string[] = []
  for (const rule of Array.from(sheet.cssRules)) {
    // Folio's CSS parser rejects url(...) format() hints and unknown
    // descriptors like font-display — the spike's working @font-face format
    // has neither (see FINDINGS.md P2-03).
    parts.push(
      rule.cssText
        .replaceAll(/\s+format\((['"])[^'"]+\1\)/g, '')
        .replaceAll(/font-display:[^;]+;/g, ''),
    )
  }
  return parts.join('\n')
}

/**
 * Folio's CSS tokenizer cannot handle family names with spaces (they appear
 * unquoted in serialized inline styles) — the family is renamed to its
 * space-free form in the captured CSS and in the page inline styles, and the
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

/**
 * Render the sheet off-screen and return the standalone HTML document
 * (page divs + @page CSS + inline styles + font faces) for Folio.
 */
export async function renderSheetHTML(options: RenderSheetOptions): Promise<string> {
  const { content, layout, settings, pdfTitle } = options

  const host = document.createElement('div')
  host.setAttribute('data-izkor-capture', '')
  host.style.cssText =
    `position:fixed;left:-9999px;top:0;width:${layout.page.widthPx}px;` +
    'background:#fff;z-index:2147483647;'
  document.body.appendChild(host)

  const root = createRoot(host)
  try {
    root.render(<SheetDocument content={content} layout={layout} settings={settings} />)
    if (document.fonts?.ready) await document.fonts.ready
    forceReflow(host)
    await waitFrames(3)

    const pages = Array.from(host.querySelectorAll('.izkor-page')).map(
      (page) => (page as HTMLElement).outerHTML,
    )
    const sheetStyle = host.querySelector<HTMLStyleElement>('style[data-izkor-sheet]')
    const capturedStyles = sheetStyle ? captureSheetStyles(sheetStyle) : ''

    const pdfFamily = layout.fontFamily.replaceAll(/\s+/g, '')
    const pdfCss = capturedStyles
      ? compactFontFamily(capturedStyles, layout.fontFamily, pdfFamily) + '\n'
      : ''
    const pdfPages = pages
      .map((page) => compactFontFamily(page, layout.fontFamily, pdfFamily))
      .join('\n')

    const title = pdfTitle ? `<title>${escapeHtml(pdfTitle)}</title>\n` : ''
    return (
      '<!DOCTYPE html>\n<html dir="rtl" lang="he">\n<head>\n' +
      '<meta charset="UTF-8">\n' +
      title +
      '<style>\n' +
      pdfCss +
      (layout.page.pageCss ? layout.page.pageCss + '\n' : '') +
      'body{margin:0;padding:0;}\n' +
      '</style>\n</head>\n<body>\n' +
      pdfPages +
      '\n</body>\n</html>'
    )
  } finally {
    root.unmount()
    host.remove()
  }
}
