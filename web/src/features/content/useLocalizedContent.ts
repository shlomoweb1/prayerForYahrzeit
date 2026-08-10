import { useTranslation } from 'react-i18next'

/**
 * Picks the best-authored markdown for the active locale, falling back to a
 * given default locale when that language has no (non-blank) translation.
 * Same convention as bio-versions.
 */
export function useLocalizedContent(
  contentByLocale: Record<string, string>,
  fallback: string,
): string {
  const { i18n } = useTranslation()
  const localized = contentByLocale[i18n.language]
  return localized && localized.trim() ? localized : fallback
}
