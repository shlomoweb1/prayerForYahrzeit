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
        className="bg-primary text-primary-foreground focus:not-sr-only sr-only inset-s-4 top-4 z-50 rounded-md px-4 py-2 text-sm"
      >
        {t('common.skipLink')}
      </a>
      <Header />
      <main id="main" className="flex-1 px-4 py-8 bg-no-repeat bg-cover bg-[url('/images/magnific_subtle-marble-and-fine-ha_yi4LguxPW9.jpg')]">
        <div className="mx-auto w-full max-w-4xl">
        <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}