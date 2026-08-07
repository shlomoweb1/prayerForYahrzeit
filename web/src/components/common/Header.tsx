import { useTranslation } from 'react-i18next'

import { LocalePicker } from '@/features/i18n/locale-picker'
import { HomeIcon } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">


          <span className="font-display text-xl text-gold lang-he:font-keter">
            {t('common.bsd')}
          </span>
          {
            location.pathname !== '/' && (
              <Link to="/" className="group font-display text-xl text-muted-foreground lang-he:font-keter flex items-center gap-1 no-underline hover:text-gold">
                <HomeIcon className="size-6 border rounded-sm p-0.75 border-muted-foreground group-hover:border-gold" />
                <span>דף הבית</span>
              </Link>
            )
          }
        </div>
        <LocalePicker />
      </div>
    </header>
  )
}
