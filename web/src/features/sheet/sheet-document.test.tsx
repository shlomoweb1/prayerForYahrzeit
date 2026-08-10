import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { buildSheetContent } from '@/features/sheet/content'
import { defaultElementFonts, printLayoutDefaults } from '@/features/sheet/layout'
import { SheetDocument } from '@/features/sheet/sheet-document'
import type { SheetSettings } from '@/features/sheet/layout'

const settings = (overrides: Partial<SheetSettings> = {}): SheetSettings => ({
  paper: 'a4',
  gender: 'male',
  nusach: 'ashkenaz',
  name: 'יונתן יוסף',
  parent: 'צבי מרדכי',
  lineage: 'none',
  font: 'noto-serif',
  fonts: defaultElementFonts('noto-serif'),
  lineDensity: 'normal',
  nikud: 1,
  deco: 1,
  acrostic: 'both',
  blessing: 0,
  hashkavaVariant: 'elMaleh',
  kaddishResponseLabel: 'congregation',
  elMalehPhrase: 'charity',
  sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
  ...overrides,
})

// jsdom doesn't do real layout (clientHeight/offsetTop are always 0), so
// useSheetPagePlan's measure-and-pack never runs and every item lands on one
// page - these are smoke tests for markup shape, not real pagination
// (pagination.test.ts and the useSheetPagePlan machinery cover that).

describe('SheetDocument', () => {
  it('renders the header line', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument content={buildSheetContent(settings())} layout={layout} settings={settings()} />,
    )
    const title = container.querySelector('[data-content="title"] h2')
    expect(title?.textContent).toContain('לע״נ יונתן יוסף בן צבי מרדכי ז״ל')
  })

  it('renders at least one page with the בס"ד/title/footer chrome', () => {
    const layout = printLayoutDefaults('a4')
    const { container } = render(
      <SheetDocument
        content={buildSheetContent(settings({ blessing: 1 }))}
        layout={layout}
        settings={settings({ blessing: 1 })}
      />,
    )
    // Real output pages only - excludes the hidden measure-stack templates,
    // which also carry [data-page] (see renderSheetHTML.tsx for why).
    const pages = Array.from(container.querySelectorAll('[data-page]')).filter(
      (page) => !page.closest('[data-sheet-measure]'),
    )
    expect(pages.length).toBeGreaterThan(0)
    expect(pages[0]?.querySelector('[data-content="bsd"]')).not.toBeNull()
    expect(pages[0]?.querySelector('[data-content="footer-paganation"]')).not.toBeNull()
  })

  it('renders every page item kind without crashing', () => {
    const layout = printLayoutDefaults('a4')
    expect(() =>
      render(<SheetDocument content={buildSheetContent(settings())} layout={layout} settings={settings()} />),
    ).not.toThrow()
  })
})
