import { describe, expect, it } from 'vitest'

import { SECTIONS, WizardQuery } from '@/features/wizard/wizard-query'

describe('WizardQuery schema', () => {
  it('parses a full URL query from string params', () => {
    const parsed = WizardQuery.parse({
      step: '6',
      target: 'both',
      paper: 'letter',
      gender: 'female',
      nusach: 'sefard',
      name: 'משה בן אברהם',
      parent: 'אברהם',
      font: 'noto-serif',
      nikud: '0',
      deco: '1',
      acrostic: 'name',
      sections: 'psalms,neshama',
      dialog: 'share',
    })
    expect(parsed).toMatchObject({
      step: 6,
      target: 'both',
      paper: 'letter',
      gender: 'female',
      nusach: 'sefard',
      name: 'משה בן אברהם',
      parent: 'אברהם',
      font: 'noto-serif',
      nikud: 0,
      deco: 1,
      acrostic: 'name',
      sections: ['psalms', 'neshama'],
      dialog: 'share',
    })
  })

  it('applies defaults for an empty query', () => {
    const parsed = WizardQuery.parse({})
    expect(parsed).toMatchObject({
      step: 1,
      target: 'print',
      paper: 'a4',
      gender: 'male',
      nusach: 'ashkenaz',
      font: 'noto-serif',
      nikud: 1,
      deco: 1,
      acrostic: 'both',
      sections: [...SECTIONS],
    })
    expect(parsed.dialog).toBeUndefined()
    expect(parsed.name).toBeUndefined()
    expect(parsed.parent).toBeUndefined()
  })

  it('accepts sections as an array for programmatic navigation', () => {
    const parsed = WizardQuery.parse({ sections: ['kaddish', 'closing'] })
    expect(parsed.sections).toEqual(['kaddish', 'closing'])
  })

  it('clamps out-of-range step values instead of rejecting the URL', () => {
    expect(WizardQuery.parse({ step: '99' }).step).toBe(7)
    expect(WizardQuery.parse({ step: '-2' }).step).toBe(1)
    expect(WizardQuery.parse({ step: 'abc' }).step).toBe(1)
  })

  it('falls back to safe values for invalid enums and numbers', () => {
    const parsed = WizardQuery.parse({ target: 'banana', nikud: 'x' })
    expect(parsed.target).toBe('print')
    expect(parsed.nikud).toBe(1)
  })

  it('handles optional dialog param', () => {
    expect(WizardQuery.parse({ dialog: 'print' }).dialog).toBe('print')
    expect(WizardQuery.parse({ dialog: 'nope' }).dialog).toBeUndefined()
  })
})
