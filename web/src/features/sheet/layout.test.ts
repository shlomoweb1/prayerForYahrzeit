import { describe, expect, it } from 'vitest'

import { SHEET_FONTS, fontDef } from '@/features/sheet/fonts'
import {
  a4PageSpec,
  buildLayout,
  contentHeight,
  contentWidth,
  letterPageSpec,
  printLayoutDefaults,
} from '@/features/sheet/layout'

describe('page specs', () => {
  it('a4 is 210x297mm @96dpi, unrounded (precision matters for Folio parity — see a4PageSpec doc comment)', () => {
    const spec = a4PageSpec()
    const MM_TO_PX = 96 / 25.4
    expect(spec.widthPx).toBeCloseTo(210 * MM_TO_PX, 10)
    expect(spec.heightPx).toBeCloseTo(297 * MM_TO_PX, 10)
    // Sanity check against the whole-pixel figure a human would expect —
    // must be close (rendering is indistinguishable) but not equal
    // (equal would mean the rounding regressed).
    expect(spec.widthPx).toBeCloseTo(794, 0)
    expect(spec.heightPx).toBeCloseTo(1123, 0)
    expect(spec.pageCss).toContain('size:210mm 297mm')
    expect(spec.pageCss).toContain('margin:0')
  })

  it('letter is 216x279mm (816x1056 px @96dpi)', () => {
    const spec = letterPageSpec()
    expect(spec.widthPx).toBe(816)
    expect(spec.heightPx).toBe(1056)
  })
})

describe('layout defaults', () => {
  it('print base font is within 10.5-11pt (14-14.7px)', () => {
    const layout = printLayoutDefaults('a4')
    expect(layout.baseFontPx).toBeGreaterThanOrEqual(14)
    expect(layout.baseFontPx).toBeLessThanOrEqual(14.7)
    expect(layout.page).toEqual(a4PageSpec())
  })

  it('print margins are within 12-15mm (45-57px)', () => {
    const layout = printLayoutDefaults('a4')
    for (const margin of [layout.marginX, layout.marginY]) {
      expect(margin).toBeGreaterThanOrEqual(Math.round(12 * (96 / 25.4)))
      expect(margin).toBeLessThanOrEqual(Math.round(15 * (96 / 25.4)))
    }
  })

  it('buildLayout applies the fontId without touching geometry', () => {
    const layout = buildLayout('letter', 'rashi')
    expect(layout.fontId).toBe('rashi')
    expect(layout.page).toEqual(letterPageSpec())
    expect(layout.baseFontPx).toBe(printLayoutDefaults('letter').baseFontPx)
  })

  it('content box = page minus margins', () => {
    const layout = printLayoutDefaults('a4')
    expect(contentWidth(layout)).toBe(layout.page.widthPx - layout.marginX * 2)
    expect(contentHeight(layout)).toBe(layout.page.heightPx - layout.marginY * 2)
  })
})

describe('font registry', () => {
  it('covers every font id with a cssFamily and at least one file', () => {
    const ids = Object.keys(SHEET_FONTS)
    expect(ids).toEqual(expect.arrayContaining(['noto-serif', 'noto-sans', 'rashi', 'frank-ruhl', 'taamey', 'keter']))
    for (const def of Object.values(SHEET_FONTS)) {
      expect(def.cssFamily.length).toBeGreaterThan(0)
      expect(def.files.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('fontDef resolves file names per weight', () => {
    expect(fontDef('taamey').files[0]?.file).toBe('medium-full.ttf')
  })
})
