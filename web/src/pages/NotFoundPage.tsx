import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  isLocaleNeutralPath,
  localizedPath,
  useRouteLocale,
} from '@/features/i18n/route-locale'

function BackHomeLink() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const routeLocale = useRouteLocale()
  // On a locale-neutral route (the wizard) we fall back to the Hebrew home;
  // elsewhere the link returns to the current locale's home form.
  const base = isLocaleNeutralPath(pathname) ? '/' : localizedPath(pathname, routeLocale)
  return (
    <Link to={base} className="text-sm">
      {t('common.notFound.backHome')}
    </Link>
  )
}

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground text-sm">{t('common.notFound.description')}</p>
      <BackHomeLink />
    </div>
  )
}

export function NotFoundComponent() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground text-sm">{t('common.notFound.description')}</p>
      <BackHomeLink />
    </div>
  )
}
