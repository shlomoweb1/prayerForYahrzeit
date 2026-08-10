import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

import { LocalePicker } from '@/features/i18n/locale-picker'
import {
  localizedPath,
  useRouteLocale,
  type RouteLocale,
} from '@/features/i18n/route-locale'

function toForm(locale: RouteLocale, path: string): string {
  return localizedPath(path, locale)
}

export default function Header() {
  const { t } = useTranslation()
  const routeLocale = useRouteLocale()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/50 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pb-3 pt-4">
        <span
          aria-hidden="true"
          dir="rtl"
          className="pointer-events-none absolute inset-s-4 top-[0.3em] text-[10px] leading-none text-muted-foreground lang-he:font-keter"
        >
          {t('common.siyata.he')}
        </span>
        <div className="flex items-center gap-4">
          <Link to={toForm(routeLocale, '/')} className="group font-display text-xl text-muted-foreground lang-he:font-keter flex items-center gap-1 no-underline hover:text-gold">
            <span>{t('common.nav.home')}</span>
          </Link>
          <Link to={toForm(routeLocale, '/about')} className="font-display text-xl text-muted-foreground lang-he:font-keter no-underline hover:text-gold">
            {t('common.nav.about')}
          </Link>
          <Link to={toForm(routeLocale, '/blog')} className="font-display text-xl text-muted-foreground lang-he:font-keter no-underline hover:text-gold">
            {t('common.nav.blog')}
          </Link>
        </div>
        <LocalePicker />
      </div>
    </header>
  )
}
