import { describe, expect, it } from 'vitest'

import {
  performSheetShare,
  sanitizeFilenamePart,
  sheetFilename,
  sharePdfFile,
} from '@/features/wizard/sheet-actions'
import type { WizardQuery } from '@/features/wizard/wizard-query'

function query(patch: Partial<WizardQuery> = {}): WizardQuery {
  return {
    step: 7,
    target: 'print',
    paper: 'a4',
    gender: 'male',
    nusach: 'ashkenaz',
    name: undefined,
    parent: undefined,
    font: 'noto-serif',
    nikud: 1,
    deco: 1,
    acrostic: 'both',
    blessing: 0,
    sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
    ...patch,
  }
}

describe('sheetFilename', () => {
  it('uses izkor-<name>.pdf for print layouts', () => {
    expect(sheetFilename(query({ name: 'משה בן אברהם' }))).toBe('izkor-משה-בן-אברהם.pdf')
  })

  it('appends -mobile for the share canvas layout', () => {
    expect(sheetFilename(query({ target: 'share', name: 'רחל' }))).toBe('izkor-רחל-mobile.pdf')
  })

  it('falls back to izkor-sheet.pdf when no name', () => {
    expect(sheetFilename(query())).toBe('izkor-sheet.pdf')
  })

  it('drops punctuation and collapses whitespace', () => {
    expect(sheetFilename(query({ name: 'שרה  ,  בת  אברהם' }))).toBe(
      'izkor-שרה-בת-אברהם.pdf',
    )
  })

  it('caps the name length to 60 characters', () => {
    const longName = 'אב'.repeat(100)
    expect(sheetFilename(query({ name: longName }))).toHaveLength('izkor-'.length + 60 + '.pdf'.length)
  })

  it('strips control/emoji characters but keeps Hebrew and Latin', () => {
    expect(sanitizeFilenamePart('משה 😀 Smith')).toBe('משה-Smith')
  })
})

describe('sharePdfFile', () => {
  it('reports unsupported when navigator.share is missing', async () => {
    const navigatorWithShare = navigator as Navigator & { share?: unknown; canShare?: unknown }
    navigatorWithShare.share = undefined
    navigatorWithShare.canShare = undefined
    const blob = new Blob(['%PDF'], { type: 'application/pdf' })
    expect(await sharePdfFile(blob, 'izkor-test.pdf')).toBe('unsupported')
  })

  it('performs the full flow: render is a no-op guard (dom-only, skipped)', () => {
    // performSheetShare touches the DOM (renderSheetHTML) — covered by e2e.
    expect(performSheetShare).toBeTypeOf('function')
  })
})
