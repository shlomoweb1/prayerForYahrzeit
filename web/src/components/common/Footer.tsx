import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { A11yWidget } from '@/features/a11y/widget'
import { ThemeSwitcher } from '@/features/theme/theme-switcher'
import { ThemeToggle } from '@/features/theme/theme-toggle'

// const PRAYER_CATEGORIES = ['yizkor', 'kaddish', 'psalms', 'mishnayot', 'hashkava'] as const

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t bg-background/60 backdrop-blur">
      <div className="mx-auto flex flex-row max-w-6xl gap-8 px-4 py-8">
        <div className="grid gap-2 grow">
          {/* <p className="font-display text-lg text-gold">{t('common.brand')}</p>
          <p className="text-sm text-muted-foreground">{t('common.tagline')}</p> */}
          <p className="mt-2 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('common.brand')} — {t('common.footer.rights')}
          </p>
        </div>

        {/* <nav aria-label={t('common.footer.prayers')} className="grid gap-2"> */}
          {/* <h2 className="text-sm font-semibold">{t('common.footer.prayers')}</h2>
          {PRAYER_CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/wizard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`common.footer.categories.${category}`)}
            </Link>
          ))} */}
        {/* </nav> */}

        <div className="grid content-end gap-3">
          <div className="flex-wrap items-end gap-2 inline-flex justify-end">
            <ThemeToggle />
            <ThemeSwitcher />
            <A11yWidget />
          </div>
        </div>
      </div>
    </footer>
  )
}
