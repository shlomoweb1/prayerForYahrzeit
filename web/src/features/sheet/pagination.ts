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
 * with them — a heading never dangles alone at the bottom of a page.
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
  /** Available content height per page in px (page minus vertical margins). */
  maxHeight: number
}

/**
 * Pack items into pages. An item taller than the whole page is placed on its
 * own page (the caller clips it via page overflow rules).
 */
export function paginate<T extends PageableItem>(items: T[], options: PaginateOptions<T>): PagePlan<T> {
  const { heightOf, maxHeight } = options
  const pages: T[][] = []
  let page: T[] = []
  let used = 0

  const openPage = (): void => {
    page = []
    pages.push(page)
    used = 0
  }
  openPage()

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]!
    const height = heightOf(item)

    if (page.length === 0) {
      page.push(item)
      used = height
      continue
    }

    if (used + height <= maxHeight) {
      const next = items[i + 1]
      const headingWouldDangle = item.keepWithNext === true && next !== undefined
      if (headingWouldDangle && used + height + heightOf(next) > maxHeight) {
        openPage()
      }
      page.push(item)
      used += height
      continue
    }

    openPage()
    page.push(item)
    used = height
  }

  if (pages.length === 0 || pages[pages.length - 1]!.length === 0) {
    pages.pop()
  }
  return pages
}
