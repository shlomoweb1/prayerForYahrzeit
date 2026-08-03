import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { A11yWidget } from '@/features/a11y/widget'
import { LocalePicker } from '@/features/i18n/locale-picker'

function Header() {
  const { t } = useTranslation()
  return (
    <header className="border-b bg-background/95 sticky top-0 z-40 backdrop-blur">
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

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {t('common.brand')} — {t('common.footer.rights')}
        </p>
        <Link to="/accessibility" className="text-sm">
          {t('common.footer.accessibility')}
        </Link>
      </div>
    </footer>
  )
}

function RootComponent() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="bg-primary text-primary-foreground focus:not-sr-only sr-only start-4 top-4 z-50 rounded-md px-4 py-2 text-sm"
      >
        {t('common.skipLink')}
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground text-sm">{t('common.notFound.description')}</p>
      <Link to="/" className="text-sm">
        {t('common.notFound.backHome')}
      </Link>
    </div>
  )
}
