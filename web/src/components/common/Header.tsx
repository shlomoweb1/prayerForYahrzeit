import { useTranslation } from 'react-i18next'

import { LocalePicker } from '@/features/i18n/locale-picker'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const { t } = useTranslation();


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
          {
            <Link to="/" className="group font-display text-xl text-muted-foreground lang-he:font-keter flex items-center gap-1 no-underline hover:text-gold">
              <span>{t('common.nav.home')}</span>
            </Link>
          }
          {
            <Link to="/about" className="font-display text-xl text-muted-foreground lang-he:font-keter no-underline hover:text-gold">
              {t('common.nav.about')}
            </Link>
          }
          {
            <Link to="/tools/system" className="font-display text-xl text-muted-foreground lang-he:font-keter no-underline hover:text-gold">
              {t('common.nav.tools')}
            </Link>
          }
          {
            <Link to="/tools/folio" className="font-display text-xl text-muted-foreground lang-he:font-keter no-underline hover:text-gold">
              {t('common.nav.folio')}
            </Link>
          }
        </div>
        <LocalePicker />
      </div>
    </header>
  )
}
