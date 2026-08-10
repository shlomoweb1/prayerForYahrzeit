import { describe, expect, it } from 'vitest'

import { paginate, type PageableItem } from '@/features/sheet/pagination'

interface TestItem extends PageableItem {
  label: string
  h: number
}

const item = (id: string, h: number, keepWithNext = false): TestItem => ({ id, label: id, h, keepWithNext })

const heightOf = (it: TestItem): number => it.h

describe('paginate', () => {
  it('returns no pages for an empty item list', () => {
    expect(paginate([], { heightOf, maxHeight: 1000 })).toEqual([])
  })

  it('packs everything into a single page when it fits', () => {
    const items = [item('a', 100), item('b', 200), item('c', 300)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages).toHaveLength(1)
    expect(pages[0]).toEqual(items)
  })

  it('keeps items together at the exact boundary', () => {
    const items = [item('a', 400), item('b', 600)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages).toHaveLength(1)
    expect(pages[0]!.map((it) => it.id)).toEqual(['a', 'b'])
  })

  it('moves a whole item to the next page when it does not fit', () => {
    const items = [item('a', 600), item('b', 500), item('c', 100)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages.map((page) => page.map((it) => it.id))).toEqual([
      ['a'],
      ['b', 'c'],
    ])
  })

  it('flows many small splittable items across pages', () => {
    const items = Array.from({ length: 9 }, (_, i) => item(`v${i}`, 200))
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages).toHaveLength(2)
    expect(pages[0]).toHaveLength(5)
    expect(pages[1]).toHaveLength(4)
  })

  it('keeps a heading with its following item when it would dangle', () => {
    const items = [item('a', 300), item('heading', 100, true), item('body', 600)]
    const pages = paginate(items, { heightOf, maxHeight: 900 })
    expect(pages.map((page) => page.map((it) => it.id))).toEqual([
      ['a'],
      ['heading', 'body'],
    ])
  })

  it('lets a heading stay on a page when the next item also fits', () => {
    const items = [item('a', 200), item('heading', 100, true), item('body', 300), item('next', 400)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages).toHaveLength(1)
    expect(pages[0]!.map((it) => it.id)).toEqual(['a', 'heading', 'body', 'next'])
  })

  it('does not re-open a page for a heading that cannot fit anywhere', () => {
    const items = [item('heading', 100, true), item('body', 2000)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages.map((page) => page.map((it) => it.id))).toEqual([
      ['heading'],
      ['body'],
    ])
  })

  it('keeps a chain of nested headings with their body instead of dangling', () => {
    // section-title -> sub-heading -> body, e.g. "משניות" -> mishnah title -> text.
    const items = [
      item('a', 500),
      item('section', 80, true),
      item('sub-heading', 60, true),
      item('body', 300),
    ]
    const pages = paginate(items, { heightOf, maxHeight: 900 })
    expect(pages.map((page) => page.map((it) => it.id))).toEqual([
      ['a'],
      ['section', 'sub-heading', 'body'],
    ])
  })

  it('places an oversized item on its own page without stalling the flow', () => {
    const items = [item('huge', 5000), item('small', 100)]
    const pages = paginate(items, { heightOf, maxHeight: 1000 })
    expect(pages.map((page) => page.map((it) => it.id))).toEqual([
      ['huge'],
      ['small'],
    ])
  })

  it('demotes the last item on a page when its own trailing margin (trapped by overflow:hidden) would overflow', () => {
    // Reproduces a real captured page: heightOf's delta-based measurement
    // (gap-before-item) landed the packed total 8px short of the content
    // box's true scrollHeight - exactly the last item's own margin-bottom,
    // which only shows up via the gap to a *following* item that isn't on
    // this page. Numbers are the real measured values (px) from that page.
    interface MarginItem extends PageableItem {
      h: number
      mb: number
    }
    const mi = (id: string, h: number, mb: number): MarginItem => ({ id, h, mb })
    // heightOf is delta-based in the real app (each item's own box plus the
    // collapsed gap *before* it, revealed by the previous item's own
    // trailing margin) - not a bare box height. Values below fold that in,
    // matching how useSheetPagePlan actually measures items.
    const items = [
      mi('long-psalm', 322.25, 8.085), // first item: no gap-before to fold in
      mi('short-1', 66.5 + 8.085, 8.085), // gap-before = long-psalm's own mb
      mi('section-title', 21.75 + 8.085, 5.25), // max(short-1 mb 8.085, own mt 7.5)
      mi('short-2', 66.5 + 5.25, 8.085), // max(section-title mb 5.25, own mt 0)
      mi('short-3', 66.5 + 8.085, 8.085),
      mi('short-4', 66.5 + 8.085, 8.085),
      mi('short-5', 66.5 + 8.085, 8.085),
      mi('short-6', 66.5 + 8.085, 8.085),
      mi('short-7', 66.5 + 8.085, 8.085),
      mi('short-8', 66.5 + 8.085, 8.085),
    ]
    const pages = paginate(items, {
      heightOf: (it: MarginItem) => it.h,
      marginBottomOf: (it: MarginItem) => it.mb,
      maxHeight: 946.921875,
    })
    // Without the fix, all 10 items pack onto one page (heightOf sums to
    // 946, under maxHeight) even though the true rendered total (946 +
    // short-8's own trapped 8.085px margin) is 954.085 - over budget.
    expect(pages[0]!.map((it) => it.id)).not.toContain('short-8')
    expect(pages.flatMap((p) => p.map((it) => it.id))).toEqual(items.map((it) => it.id))
  })

  it('does not demote when the last item fits with its own margin included', () => {
    interface MarginItem extends PageableItem {
      h: number
      mb: number
    }
    const mi = (id: string, h: number, mb: number): MarginItem => ({ id, h, mb })
    const items = [mi('a', 100, 10), mi('b', 200, 10)]
    const pages = paginate(items, {
      heightOf: (it: MarginItem) => it.h,
      marginBottomOf: (it: MarginItem) => it.mb,
      maxHeight: 320,
    })
    expect(pages).toHaveLength(1)
    expect(pages[0]!.map((it) => it.id)).toEqual(['a', 'b'])
  })
})
