/**
 * Shelf-packing pagination for sheet content, ported from tziyun-berga's
 * useExamLayout. Two separate hidden templates, each single-purpose:
 *
 *  - `emptyContentRef` is a real page's content column with NOTHING in it -
 *    its clientHeight is the fixed per-page budget. It must stay empty: a
 *    flex-grow box's min-height defaults to `auto`, so if it held content
 *    taller than its share, it would grow to fit that content instead of
 *    reporting the real budget (that's what "items rendered inside the same
 *    box used for the height budget" breaks).
 *  - `itemsHostRef` is a second page's content column holding every item -
 *    only used to read each item's real wrapped-line height at the exact
 *    real content width (measuring items at any other width silently gives
 *    wrong heights, since Hebrew text wraps differently).
 *
 * paginate() (pagination.ts) then packs the measured items onto pages in
 * fixed order using the budget from the first template.
 *
 * `splitOversized` (optional) is the fallback for an item that's still
 * taller than a whole empty page (e.g. one unusually long psalm chapter
 * rendered as a single flowing block) - pack alone can't fix that, an item
 * either fits on a page or it doesn't. When a measured item exceeds
 * maxHeight, this callback gets the item's own rendered element and must
 * return 2+ replacement items (e.g. the same chapter cut into smaller
 * flowing chunks at a verse boundary) or null if it can't be split. The
 * replacements go back through another real measure+pack pass - same as
 * every other item, not an estimate - so pass counts and chunk heights stay
 * correct automatically.
 */
import { useLayoutEffect, useState } from 'react'
import type { RefObject } from 'react'

import { paginate, type PageableItem } from '@/features/sheet/pagination'

const MAX_SPLIT_PASSES = 3

// Folio (the PDF engine) and the browser agree on per-line text metrics
// almost exactly, but a page's flex-column budget for its flex-grow content
// box can still land a point or two short of what the browser computes for
// the same CSS (see go-html-to-pdf's ADR-001 "Consequences": a confirmed,
// documented, small residual gap between the two engines' page-content
// budgets, left as an explicit out-of-scope policy question there). The
// browser's own `overflow: hidden` silently clips a sub-pixel sliver of
// content when a page is packed flush against its exact measured budget -
// invisible in the live preview - but Folio can't silently drop content, so
// that same sliver forces a whole extra near-blank page (and can visually
// drop the last-fitting item's own inline content, like a chapter badge,
// depending on exactly where the cut lands). Packing pages a few px under
// budget keeps every page genuinely inside both engines' agreement zone.
const PAGINATION_SAFETY_MARGIN_PX = 8

export interface SheetPagePlan<T> {
  plan: T[][]
  /** The item list actually measured/packed - differs from the input once an oversized item has been split. */
  measuredItems: T[]
}

export function useSheetPagePlan<T extends PageableItem>(
  items: T[],
  emptyContentRef: RefObject<HTMLDivElement | null>,
  itemsHostRef: RefObject<HTMLDivElement | null>,
  splitOversized?: (item: T, el: HTMLElement, maxHeight: number) => T[] | null,
): SheetPagePlan<T> {
  const [plan, setPlan] = useState<T[][]>([items])
  const [effectiveItems, setEffectiveItems] = useState<T[]>(items)
  const [splitPass, setSplitPass] = useState(0)
  // Tracks the last `items` value seen, so the state reset below only runs
  // once per external change (React's sanctioned "adjust state during render
  // when a prop changes" pattern - cheaper than an extra effect + render).
  const [prevItems, setPrevItems] = useState(items)
  if (prevItems !== items) {
    setPrevItems(items)
    setEffectiveItems(items)
    setSplitPass(0)
  }

  useLayoutEffect(() => {
    const emptyContent = emptyContentRef.current
    const host = itemsHostRef.current
    if (!emptyContent || !host) return

    const measureAndPack = () => {
      const maxHeight = emptyContent.clientHeight - PAGINATION_SAFETY_MARGIN_PX
      if (maxHeight <= 0) return

      const heightsById = new Map<string, number>()
      const marginBottomsById = new Map<string, number>()
      const elsById = new Map<string, HTMLElement>()
      let lastBottom = 0
      for (const child of Array.from(host.children)) {
        const el = child as HTMLElement
        const bottom = el.offsetTop + el.offsetHeight
        const id = el.dataset.itemId
        if (id) {
          heightsById.set(id, Math.max(0, bottom - lastBottom))
          elsById.set(id, el)
          // The wrapper div itself never carries CSS margin - renderPageItem
          // puts it on the actual rendered element (the <p>/<h2>/<div>
          // inside). Needed by paginate()'s marginBottomOf: see its doc
          // comment for why the item that ends up last on a page needs its
          // own trailing margin measured directly, not derived from the
          // gap to a following item.
          const inner = el.firstElementChild as HTMLElement | null
          marginBottomsById.set(id, inner ? parseFloat(getComputedStyle(inner).marginBottom) || 0 : 0)
        }
        lastBottom = bottom
      }

      if (splitOversized && splitPass < MAX_SPLIT_PASSES) {
        let didSplit = false
        const next: T[] = []
        for (const item of effectiveItems) {
          const height = heightsById.get(item.id) ?? 0
          const el = elsById.get(item.id)
          const replacement = height > maxHeight && el ? splitOversized(item, el, maxHeight) : null
          if (replacement && replacement.length > 1) {
            next.push(...replacement)
            didSplit = true
          } else {
            next.push(item)
          }
        }
        if (didSplit) {
          setSplitPass((n) => n + 1)
          setEffectiveItems(next)
          return
        }
      }

      setPlan(
        paginate(effectiveItems, {
          heightOf: (item) => heightsById.get(item.id) ?? 0,
          marginBottomOf: (item) => marginBottomsById.get(item.id) ?? 0,
          maxHeight,
        }),
      )
    }

    measureAndPack()
    let fontsReady: Promise<unknown> = Promise.resolve()
    if (typeof document !== 'undefined' && document.fonts?.ready) fontsReady = document.fonts.ready
    void fontsReady.then(measureAndPack)
  }, [effectiveItems, splitPass, emptyContentRef, itemsHostRef, splitOversized])

  return { plan, measuredItems: effectiveItems }
}
