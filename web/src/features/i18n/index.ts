import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { he } from './locales/he'

export const LOCALE_STORAGE_KEY = 'izkor:locale:v1'
export const SUPPORTED_LOCALES = ['he', 'en', 'es', 'fr'] as const
export const RTL_LOCALES: readonly string[] = ['he']

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function localeDirection(locale: string): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
}

export function isSupportedLocale(value: string | null): value is SupportedLocale {
  return value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function getStoredLocale(): SupportedLocale {
  let stored: string | null
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch {
    stored = null
  }
  return isSupportedLocale(stored) ? stored : 'he'
}

export function applyLocale(locale: SupportedLocale): void {
  document.documentElement.lang = locale
  document.documentElement.dir = localeDirection(locale)
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // storage unavailable — locale still applies for the session
  }
}

export async function initI18n(): Promise<void> {
  const stored = getStoredLocale()
  applyLocale(stored)
  await i18n.use(initReactI18next).init({
    resources: {
      he: { translation: he },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: stored,
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n
