import { useRouteLocale } from '@/features/i18n/route-locale'

/**
 * Picks the best-authored markdown for the URL's locale form, falling back to
 * a given default locale when that language has no (non-blank) translation.
 * Same convention as bio-versions. Driven by the route locale (not the i18n
 * language) so the URL form always determines the article language.
 */
export function useLocalizedContent(
  contentByLocale: Record<string, string>,
  fallback: string,
): string {
  const locale = useRouteLocale()
  const localized = contentByLocale[locale]
  return localized && localized.trim() ? localized : fallback
}
