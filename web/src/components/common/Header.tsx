import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { A11yWidget } from '@/features/a11y/widget'
import { LocalePicker } from '@/features/i18n/locale-picker'

export default function Header() {
  const { t } = useTranslation()
  return (
    <header className="border-b bg-background/50 sticky top-0 z-40 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-semibold">
          {t('common.brand')}
          <span className="sr-only">{t('common.tagline')}</span>
        </Link>
        <nav aria-label={t('common.brand')} className="flex items-center gap-2">
          <Link to="/" className="text-sm">
            {t('common.nav.home')}
          </Link>
          <Link to="/wizard" className="text-sm">
            {t('common.nav.wizard')}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocalePicker />
          <A11yWidget />
        </div>
      </div>
    </header>
  )
}