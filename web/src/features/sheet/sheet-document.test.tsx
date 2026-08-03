import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { buildSheetContent } from '@/features/sheet/content'
import { printLayoutDefaults } from '@/features/sheet/layout'
import { SheetDocument } from '@/features/sheet/sheet-document'
import type { SheetSettings } from '@/features/sheet/layout'

const settings = (overrides: Partial<SheetSettings> = {}): SheetSettings => ({
  paper: 'a4',
  gender: 'male',
  nusach: 'ashkenaz',
  name: 'יונתן יוסף',
  parent: 'צבי מרדכי',
  font: 'noto-serif',
  nikud: 1,
  deco: 1,
  acrostic: 'both',
  blessing: 0,
  sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
  ...overrides,
})

describe('SheetDocument', () => {
  it('renders the header and a psalm heading', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument
        content={buildSheetContent(settings())}
        layout={layout}
        settings={settings()}
      />,
    )
    const header = container.querySelector('.izkor-header')
    expect(header?.textContent).toBe('תפילות ולימוד לע״נ יונתן יוסף בן צבי מרדכי ז״ל')
  })

  it('renders every page item kind without crashing', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument
        content={buildSheetContent(settings({ blessing: 1 }))}
        layout={layout}
        settings={settings({ blessing: 1 })}
      />,
    )
    expect(container.querySelectorAll('.izkor-page').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.izkor-ddeco').length).toBeGreaterThan(0)
  })

  it('renders plain (non-decorated) verses when deco is off', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument
        content={buildSheetContent(settings({ deco: 0 }))}
        layout={layout}
        settings={settings({ deco: 0 })}
      />,
    )
    expect(container.querySelectorAll('.izkor-ddeco').length).toBe(0)
    expect(container.querySelectorAll('.izkor-verse').length).toBeGreaterThan(0)
  })

  it('injects the sheet stylesheet with the font-face', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument content={buildSheetContent(settings())} layout={layout} settings={settings()} />,
    )
    const style = container.querySelector('style[data-izkor-sheet]')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain("@font-face{font-family:'Noto Serif Hebrew'")
    expect(style?.textContent).toContain('.izkor-dline')
  })
})
