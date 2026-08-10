import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from '@/components/ui/sonner'
import { FloatingPrayerCta } from './FloatingPrayerCta'
import { STEP_MAX } from '@/features/wizard/wizard-query'
import { cn } from '@/lib/utils'

export default function WrapperComponent() {
  const { t } = useTranslation()
  const location = useRouterState({ select: (s) => s.location })
  // The wizard's final step is an app-like editor/preview screen: it owns its
  // own internal scroll region, so the shell must be pinned to the viewport
  // instead of growing with content (which would push the footer off-screen).
  const isAppShell =
    location.pathname === '/wizard' && (location.search as { step?: number })?.step === STEP_MAX
  // The long tech documents (tools, folio) get the same pinned treatment:
  // header and footer stay on screen, the document scrolls in its own region.
  // (The routes are /tools/system and /tools/folio — a bare prefix match keeps
  // this true for any future tool page without a route file edit.)
  const isPinnedPage = location.pathname.startsWith('/tools')
  // The floating CTA's job is to route people into the wizard — hide it once
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
          content height into <html>'s own scrollable overflow on desktop —
          overflow-hidden alone doesn't stop it — which made the whole page
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
