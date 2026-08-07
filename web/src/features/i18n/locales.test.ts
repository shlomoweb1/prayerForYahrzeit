import { describe, expect, it } from 'vitest'

import { en } from '@/features/i18n/locales/en'
import { es } from '@/features/i18n/locales/es'
import { fr } from '@/features/i18n/locales/fr'
import { he } from '@/features/i18n/locales/he'
import { localeDirection, RTL_LOCALES, SUPPORTED_LOCALES } from '@/features/i18n'
import { STEP_MAX, STEP_MIN } from '@/features/wizard/wizard-query'

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') {
    return [prefix]
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('i18n locale dictionaries', () => {
  const dictionaries = { he, en, es, fr }

  it('all locales expose the exact same key structure', () => {
    const reference = flattenKeys(he).sort()
    for (const [locale, dict] of Object.entries(dictionaries)) {
      expect(flattenKeys(dict).sort(), `locale ${locale}`).toEqual(reference)
    }
  })

  it('all leaf values are strings', () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const key of flattenKeys(dict)) {
        const leaf = key.split('.').reduce<unknown>((acc, part) => {
          if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part]
          return undefined
        }, dict)
        expect(typeof leaf, `${locale}:${key}`).toBe('string')
      }
    }
  })

  it('has exactly the four supported locales with he as RTL', () => {
    expect([...SUPPORTED_LOCALES].sort()).toEqual(['en', 'es', 'fr', 'he'])
    expect(RTL_LOCALES).toEqual(['he'])
    expect(localeDirection('he')).toBe('rtl')
    expect(localeDirection('en')).toBe('ltr')
    expect(localeDirection('es')).toBe('ltr')
    expect(localeDirection('fr')).toBe('ltr')
  })

  it('has no empty leaf values', () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const key of flattenKeys(dict)) {
        const leaf = key.split('.').reduce<unknown>((acc, part) => {
          if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part]
          return undefined
        }, dict)
        expect(String(leaf).trim().length, `${locale}:${key}`).toBeGreaterThan(0)
      }
    }
  })

  it('he dictionary includes every wizard step title', () => {
    const steps = he.wizard.steps as Record<string, { title: string }>
    for (let step = STEP_MIN; step <= STEP_MAX; step += 1) {
      expect(typeof steps[String(step)]?.title).toBe('string')
    }
  })
})
