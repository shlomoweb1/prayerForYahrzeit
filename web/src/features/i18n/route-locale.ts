import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from '@tanstack/react-router'

import { applyLocale, type SupportedLocale } from './index'

/**
 * Locale-bearing URL forms (the canonical, indexable ones). Hebrew pages live
 * at the bare paths (/about, /blog/...), English pages under /en (/en/about).
 * es/fr share the /en content, so the two URL forms below are exhaustive.
 * The wizard is deliberately locale-neutral: it carries no prefix, so the
 * picker there freely drives the UI language (he/en/es/fr).
 */
export const ROUTE_LOCALES = ['he', 'en'] as const
export type RouteLocale = (typeof ROUTE_LOCALES)[number]

const EN_PREFIX = '/en'

export function isLocaleNeutralPath(pathname: string): boolean {
  return pathname === '/wizard' || pathname.startsWith('/wizard/')
}

export function isEnPath(pathname: string): boolean {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)
}

/**
 * The URL form the current page is in. Purely pathname-driven: a Hebrew
 * browser visiting a bare path gets the Hebrew route regardless of stored
 * locale, and vice versa. Never locale-neutral - callers gate on
 * isLocaleNeutralPath first.
 */
export function useRouteLocale(): RouteLocale {
  const { pathname } = useLocation()
  return isEnPath(pathname) ? 'en' : 'he'
}

/**
 * The sibling of `pathname` in the requested locale form (bare for 'he',
 * /en-prefixed for 'en'). No-op when it already is that sibling. For example
 * localizedPath('/about', 'en') === '/en/about' and
 * localizedPath('/en/about', 'he') === '/about'.
 */
export function localizedPath(pathname: string, locale: RouteLocale): string {
  if (locale === 'en') {
    if (isEnPath(pathname)) return pathname
    return `${EN_PREFIX}${pathname === '/' ? '' : pathname}`
  }
  if (isEnPath(pathname)) return pathname.slice(EN_PREFIX.length) || '/'
  return pathname
}

/**
 * Keeps the i18n UI language and the persisted locale in step with the URL
 * form on content routes, so the rendered chrome matches the article's
 * language. The wizard is exempt - it is locale-neutral and the picker choice
 * there must survive.
 */
export function useSyncRouteLocale(pathname: string): void {
  const { i18n } = useTranslation()
  const locale = useRouteLocale()
  const neutral = isLocaleNeutralPath(pathname)

  useEffect(() => {
    if (neutral) return
    const next = locale as SupportedLocale
    if (i18n.resolvedLanguage !== next) {
      void i18n.changeLanguage(next)
    }
    applyLocale(next)
  }, [locale, neutral, i18n])
}
