import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from '@/components/ui/sonner'
import { FloatingPrayerCta } from './FloatingPrayerCta'
import { useSyncRouteLocale } from '@/features/i18n/route-locale'
import { RouteHead } from '@/features/seo/RouteHead'
import { STEP_MAX } from '@/features/wizard/wizard-query'
import { cn } from '@/lib/utils'

export default function WrapperComponent() {
  const { t, i18n } = useTranslation()
  const location = useRouterState({ select: (s) => s.location })
  // The route locale owns the UI language on content routes (bare path =
  // Hebrew, /en = English); the wizard is exempt and keeps the picker choice.
  useSyncRouteLocale(location.pathname)
  // The wizard's final step is an app-like editor/preview screen: it owns its
  // own internal scroll region, so the shell must be pinned to the viewport
  // instead of growing with content (which would push the footer off-screen).
  const isAppShell =
  location.pathname === '/wizard' && (location.search as { step?: number })?.step === STEP_MAX
  // The blog post pages get the same pinned treatment: header and footer stay
  // on screen, the article scrolls in its own region. The /blog (or /en/blog)
  // index has no trailing slash, so it doesn't match and scrolls normally
  // like the landing page - matching on `/blog/` (with the optional locale
  // prefix) keeps this true for any future post route or locale without a
  // route file edit.
  // @ts-expect-error i18n types verify in browser
  const supportedLangs = Object.keys(i18n.options.resources).filter(k=>k!=i18n.options.fallbackLng[0]);
  const isPinnedPage = (new RegExp(`^\\/(?:(${supportedLangs.join("|")})\\/)?blog\\/`)).test(location.pathname)
  // The floating CTA's job is to route people into the wizard - hide it once
  // they're already inside the creation flow.
  const inWizard = location.pathname.startsWith('/wizard')

  return (
    <div
      className={cn(
        'flex flex-col bg-cover bg-center bg-no-repeat',
        isAppShell || isPinnedPage ? 'h-dvh overflow-hidden' : 'min-h-dvh',
      )}
      style={{ backgroundImage: 'var(--app-backdrop)' }}
    >
      <RouteHead />
      <a
        href="#main"
        className="sr-only inset-s-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only"
      >
        {t('common.skipLink')}
      </a>
      <Header />
      {/* `contain-layout` (not just overflow-hidden) is load-bearing: the
          deeply-nested `overflow-y-auto` scroll panels inside the step-5
          editor (settings sidebar + A4 preview) still leak their intrinsic
          content height into <html>'s own scrollable overflow on desktop -
          overflow-hidden alone doesn't stop it - which made the whole page
          scroll instead of just the inner panels. Layout containment cuts
          that propagation off here. */}
      <main id="main" className={cn('flex w-full flex-1', isAppShell || isPinnedPage ? 'min-h-0 overflow-hidden contain-layout' : undefined)}>
        <div
          className={cn(
            'mx-auto flex w-full items-center justify-center',
            isAppShell || isPinnedPage ? 'h-full min-h-0 items-stretch' : undefined,
          )}
        >
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster />
      <FloatingPrayerCta hidden={isAppShell || inWizard} />
    </div>
  )
}
