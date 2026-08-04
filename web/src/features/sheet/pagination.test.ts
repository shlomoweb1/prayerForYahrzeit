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
})
