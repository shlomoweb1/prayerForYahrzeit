/**
 * P3-03 SheetDocument: measurement-based multi-page sheet.
 *
 * 1. A hidden measure stack renders every page item at the content width with
 *    the same CSS as the real pages; cumulative bottom offsets give exact
 *    stacked heights (margin collapse included).
 * 2. paginate() packs the items into pages of contentHeight.
 * 3. The pages render from the plan; a convergence pass re-checks each page's
 *    real content height (the first item of a page has an un-collapsed top
 *    margin) and re-packs with a per-item fix until stable (max 5 passes).
 *
 * This exact tree is what the off-screen capture reads, so preview and PDF
 * share the same markup.
 */

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { fontFaceCss } from '@/features/sheet/fonts'
import { buildPageItems, type PageItem } from '@/features/sheet/content'
import type { SheetBlock } from '@/features/sheet/content'
import type { SheetLayout, SheetSettings } from '@/features/sheet/layout'
import { contentHeight, contentWidth } from '@/features/sheet/layout'
import { paginate } from '@/features/sheet/pagination'
import { sheetCss } from '@/features/sheet/sheet-css'
import { WordDecoLine } from '@/features/sheet/WordDecoLine'

export interface SheetDocumentProps {
  content: SheetBlock[]
  layout: SheetLayout
  settings: SheetSettings
  /** Reports the stacked height of all rendered pages (for scale-to-fit). */
  onMeasure?: (height: number) => void
}

const MAX_PACK_PASSES = 5

function renderItem(item: PageItem, layout: SheetLayout, deco: boolean): ReactNode {
  switch (item.kind) {
    case 'header':
      return deco ? (
        <WordDecoLine
          className="izkor-header"
          text={item.text}
          decoScale={layout.decoScale}
          style={{ fontSize: layout.titleFontPx }}
        />
      ) : (
        <div className="izkor-header" style={{ fontSize: layout.titleFontPx }}>
          {item.text}
        </div>
      )
    case 'section-title':
      return <div className="izkor-heading">{item.text}</div>
    case 'block':
      return <div className="izkor-block" dangerouslySetInnerHTML={{ __html: item.html }} />
    case 'psalm-title':
      return deco ? (
        <WordDecoLine
          className="izkor-heading"
          text={item.label}
          decoScale={layout.decoScale}
          style={{ fontSize: layout.headingFontPx }}
        />
      ) : (
        <div className="izkor-heading" style={{ fontSize: layout.headingFontPx }}>
          {item.label}
        </div>
      )
    case 'psalm-verse':
      return deco ? (
        <div className="izkor-verse">
          <WordDecoLine text={item.text} decoScale={layout.decoScale} />
        </div>
      ) : (
        <div className="izkor-verse">{item.text}</div>
      )
    case 'stanza-title':
      return deco ? (
        <WordDecoLine
          className="izkor-subheading"
          text={item.label}
          decoScale={layout.decoScale}
          style={{ fontSize: layout.headingFontPx * 0.85 }}
        />
      ) : (
        <div className="izkor-subheading" style={{ fontSize: layout.headingFontPx * 0.85 }}>
          {item.label}
        </div>
      )
    case 'stanza-verse':
      return deco ? (
        <div className="izkor-verse">
          <WordDecoLine text={item.text} decoScale={layout.decoScale} />
        </div>
      ) : (
        <div className="izkor-verse">{item.text}</div>
      )
    case 'mishnah-title':
      return (
        <div>
          <div className="izkor-subheading">{item.label}</div>
          <div className="izkor-source">{item.source}</div>
        </div>
      )
    case 'mishnah-text':
      return <div className="izkor-mishnah">{item.text}</div>
  }
}

export function SheetDocument({ content, layout, settings, onMeasure }: SheetDocumentProps) {
  const items = useMemo(() => buildPageItems(content), [content])
  const [plan, setPlan] = useState<PageItem[][] | null>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const fixesRef = useRef<Map<string, number>>(new Map())
  const passRef = useRef(0)
  const deco = settings.deco === 1

  const width = layout.page.widthPx
  const height = layout.page.heightPx
  const contentW = contentWidth(layout)
  const maxHeight = contentHeight(layout)
  const fontFamily = layout.fontFamily

  // Height of a single item from the measure stack (margin collapse included),
  // plus any boundary-margin fix accumulated by the convergence pass.
  const measuredHeightOf = (item: PageItem): number => {
    const host = measureRef.current
    if (!host) return 0
    let lastBottom = 0
    for (const child of Array.from(host.children)) {
      const el = child as HTMLElement
      const bottom = el.offsetTop + el.offsetHeight
      if (el.dataset.itemId === item.id) {
        return Math.max(0, bottom - lastBottom) + (fixesRef.current.get(item.id) ?? 0)
      }
      lastBottom = bottom
    }
    return 0
  }

  // Measure the stack and pack; re-run when the fonts finish loading.
  useLayoutEffect(() => {
    const host = measureRef.current
    if (!host) return

    const measureAndPack = () => {
      if (passRef.current >= MAX_PACK_PASSES) return
      passRef.current += 1
      const heightsById = new Map<string, number>()
      let lastBottom = 0
      for (const child of Array.from(host.children)) {
        const el = child as HTMLElement
        const bottom = el.offsetTop + el.offsetHeight
        const id = el.dataset.itemId
        if (id) {
          heightsById.set(id, Math.max(0, bottom - lastBottom) + (fixesRef.current.get(id) ?? 0))
        }
        lastBottom = bottom
      }
      setPlan(paginate(items, { heightOf: (item) => heightsById.get(item.id) ?? 0, maxHeight }))
    }

    measureAndPack()
    let fontsReady: Promise<unknown> = Promise.resolve()
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      fontsReady = document.fonts.ready
    }
    void fontsReady.then(() => measureAndPack())
  }, [items, maxHeight])

  // Convergence pass: if a rendered page overflows its content box, bump the
  // height of that page's first item (its top margin is un-collapsed on a
  // page boundary) and re-pack.
  useLayoutEffect(() => {
    const pagesEl = pagesRef.current
    if (!plan || !pagesEl) return
    let overflowed = false
    for (let pageIndex = 0; pageIndex < plan.length; pageIndex += 1) {
      const pageEl = pagesEl.children[pageIndex]
      if (!pageEl) continue
      const contentEl = pageEl.querySelector('[data-izkor-content]')
      if (!contentEl) continue
      const used = (contentEl as HTMLElement).offsetHeight
      if (used > maxHeight + 0.5) {
        const first = plan[pageIndex]![0]
        if (first && passRef.current < MAX_PACK_PASSES) {
          fixesRef.current.set(first.id, used - maxHeight + (fixesRef.current.get(first.id) ?? 0))
          overflowed = true
        }
      }
    }
    if (overflowed && passRef.current < MAX_PACK_PASSES) {
      passRef.current += 1
      setPlan(paginate(items, { heightOf: (item) => measuredHeightOf(item), maxHeight }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan])

  useLayoutEffect(() => {
    const pagesEl = pagesRef.current
    if (!pagesEl) return
    onMeasure?.(pagesEl.getBoundingClientRect().height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, items])

  const pageStyle = (index: number): CSSProperties => ({
    width,
    height,
    padding: `${layout.marginY}px ${layout.marginX}px`,
    // Text styles live on the page (not just the .izkor-sheet wrapper) so the
    // standalone captured document inherits them — the capture drops ancestors.
    fontFamily,
    fontSize: layout.baseFontPx,
    lineHeight: layout.lineHeight,
    ...(index > 0 ? { pageBreakBefore: 'always' } : {}),
  })

  const sheetStyle: CSSProperties = {
    fontFamily,
    fontSize: layout.baseFontPx,
    lineHeight: layout.lineHeight,
  }

  return (
    <div className="izkor-sheet" dir="rtl" lang="he" style={sheetStyle}>
      <style data-izkor-sheet="">{fontFaceCss(layout.fontId)}\n{sheetCss()}</style>
      <div
        aria-hidden="true"
        ref={measureRef}
        style={{ position: 'relative', width: contentW, visibility: 'hidden', height: 0, overflow: 'hidden' }}
      >
        {items.map((item) => (
          <div data-item-id={item.id} key={item.id}>
            {renderItem(item, layout, deco)}
          </div>
        ))}
      </div>
      <div ref={pagesRef}>
        {(plan ?? []).map((pageItems, index) => (
          <div className="izkor-page" key={`page-${index}`} style={pageStyle(index)}>
            <div data-izkor-content>
              {pageItems.map((item) => (
                <div key={item.id}>{renderItem(item, layout, deco)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
