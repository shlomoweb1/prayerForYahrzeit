import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'



export default function WrapperComponent() {
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