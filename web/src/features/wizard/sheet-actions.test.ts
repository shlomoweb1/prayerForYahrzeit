import { describe, expect, it } from 'vitest'

import { sanitizeFilenamePart, sheetFilename } from '@/features/wizard/sheet-actions'
import type { WizardQuery } from '@/features/wizard/wizard-query'

function query(patch: Partial<WizardQuery> = {}): WizardQuery {
  return {
    step: 4,
    paper: 'a4',
    gender: 'male',
    nusach: 'ashkenaz',
    name: undefined,
    parent: undefined,
    lineage: 'none',
    font: 'noto-serif',
    nikud: 1,
    deco: 1,
    acrostic: 'both',
    blessing: 0,
    hashkavaVariant: 'elMaleh',
    editorMode: 'simple',
    editor: 0,
    lineDensity: 'normal',
    sections: ['psalms', 'neshama', 'kaddish', 'mishnayot', 'hashkava', 'closing'],
    ...patch,
  }
}

describe('sheetFilename', () => {
  it('uses izkor-<name>.pdf', () => {
    expect(sheetFilename(query({ name: 'משה בן אברהם' }))).toBe('izkor-משה-בן-אברהם.pdf')
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
