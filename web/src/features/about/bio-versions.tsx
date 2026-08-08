import { useTranslation } from 'react-i18next'

import { AboutRenderer } from './AboutRenderer'

import aEn from '@/content/about/a.en.md?raw'
import aHe from '@/content/about/a.he.md?raw'

/**
 * Three candidate bios for the about page. Only Hebrew and English have
 * authored content; other locales (es/fr) fall back to English.
 */
function useBio(he: string, en: string): string {
  const { i18n } = useTranslation()
  return i18n.language === 'he' ? he : en
}

export function BioVersionA() {
  return <AboutRenderer content={useBio(aHe, aEn)} />
}
