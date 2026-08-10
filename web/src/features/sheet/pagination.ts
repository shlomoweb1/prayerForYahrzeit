/**
 * P3-03 Sequential measurement-based page packing.
 *
 * Pure logic: given an ordered list of page items and their measured heights,
 * pack them into pages of a fixed content height. Non-splittable items (a
 * prayer block, a heading, a whole mishnah) move entirely to the next page
 * when they do not fit; psalm/letters bodies are already per-verse items at
 * this stage, so they flow across pages naturally.
 *
 * `keepWithNext` items (headings) only stay on a page if the next item fits
 * with them - a heading never dangles alone at the bottom of a page.
 */

export interface PageableItem {
  id: string
  /** Heading items must not be separated from the item that follows them. */
  keepWithNext?: boolean
}

export type PagePlan<T> = T[][]

export interface PaginateOptions<T> {
  /** Measured height of each item in px. */
  heightOf: (item: T) => number
  /**
   * Trailing margin-bottom of the item's own rendered element, in px.
   * Optional - defaults to 0 for callers with no margin concept (existing
   * tests included).
   *
   * Whichever item ends up last on a page has this margin trapped inside
   * that page's own `overflow: hidden` content box: CSS overflow:hidden
   * creates a new block formatting context, so a last child's margin
   * can't collapse through and escape the container the way it would in
   * normal flow - it becomes real, occupied space instead, extending the
   * box's actual rendered height. `heightOf` alone can't see this: it's
   * normally measured as the gap *before* an item (revealed by whatever
   * item follows it in a shared measurement column), so the item that
   * ends up last on a page never gets credited with the margin that
   * comes after it - that gap belongs to whatever item was measured next
   * in sequence, which lives on a *different* page and never reveals it.
   * Confirmed against a real captured page: summing items via heightOf
   * landed 8px short of the content box's true scrollHeight - exactly
   * one item's own margin-bottom, missing because it was the page's last
   * item. Without this, a page can be packed with more content than its
   * real occupied height allows, and a renderer that (correctly, unlike
   * a browser) can't silently clip the overflow ends up needing an extra
   * page for content the preview appears to fit.
   */
  marginBottomOf?: (item: T) => number
  /** Available content height per page in px (page minus vertical margins). */
  maxHeight: number
}

/**
 * Pack items into pages. An item taller than the whole page is placed on its
 * own page (the caller clips it via page overflow rules).
 */
export function paginate<T extends PageableItem>(items: T[], options: PaginateOptions<T>): PagePlan<T> {
  const { heightOf, maxHeight } = options
  const marginBottomOf = options.marginBottomOf ?? ((): number => 0)
  const pages: T[][] = []
  let page: T[] = []
  let used = 0

  const openPage = (): void => {
    page = []
    pages.push(page)
    used = 0
  }
  openPage()

  // Height of items[startIndex] plus every item chained to it by
  // consecutive keepWithNext flags - a heading must never be separated from
  // what it introduces, even through a run of nested headings (section
  // title -> sub-heading -> body).
  const groupHeight = (startIndex: number): number => {
    let total = 0
    let i = startIndex
    while (i < items.length) {
      const current = items[i]!
      total += heightOf(current)
      if (current.keepWithNext !== true) break
      i += 1
    }
    return total
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]!
    const height = heightOf(item)

    if (page.length === 0) {
      page.push(item)
      used = height
      continue
    }

    const requiredHeight = item.keepWithNext === true ? groupHeight(i) : height

    if (used + requiredHeight <= maxHeight) {
      page.push(item)
      used += height
      continue
    }

    // `item` doesn't fit - the page is closing with whatever's already on
    // it. Its current last item becomes that page's real last child; per
    // marginBottomOf's doc comment, verify its own trailing margin still
    // fits (heightOf never counted it, since it was measured as the gap
    // *before* whatever item came next - which isn't on this page). If it
    // doesn't fit, that item doesn't actually belong on this page: move it
    // to a fresh page and retry `item` from scratch against that new state.
    const closingItem = page[page.length - 1]!
    if (page.length > 1 && used + marginBottomOf(closingItem) > maxHeight) {
      page.pop()
      openPage()
      page.push(closingItem)
      used = heightOf(closingItem)
      i -= 1
      continue
    }

    openPage()
    page.push(item)
    used = height
  }

  // The last page never goes through the loop's own closing check above -
  // there's no "next item" to trigger it. Verify its last item the same way.
  if (page.length > 1) {
    const closingItem = page[page.length - 1]!
    if (used + marginBottomOf(closingItem) > maxHeight) {
      page.pop()
      pages.push([closingItem])
    }
  }

  if (pages.length === 0 || pages[pages.length - 1]!.length === 0) {
    pages.pop()
  }
  return pages
}
