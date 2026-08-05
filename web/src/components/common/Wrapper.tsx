import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'
import { STEP_MAX } from '@/features/wizard/wizard-query'
import { cn } from '@/lib/utils'

export default function WrapperComponent() {
    const { t } = useTranslation()
    const location = useRouterState({ select: (s) => s.location })
    // The wizard's final step is an app-like editor/preview screen: it owns its
    // own internal scroll region, so the shell must be pinned to the viewport
    // instead of growing with content (which would push the footer off-screen).
    const isAppShell = location.pathname === '/wizard' && (location.search as { step?: number })?.step === STEP_MAX

    return (
        <div
            className={cn(
                'flex flex-col bg-no-repeat bg-cover bg-[url(\'/images/Yorzait-candle-sunset.png\')]',
                isAppShell ? 'h-dvh overflow-hidden' : 'min-h-dvh',
            )}
        >
            <a
                href="#main"
                className="bg-primary text-primary-foreground focus:not-sr-only sr-only inset-s-4 top-4 z-50 rounded-md px-4 py-2 text-sm"
            >
                {t('common.skipLink')}
            </a>
            <Header />
            <main id="main" className={cn('flex w-full flex-1', isAppShell && 'min-h-0 overflow-hidden')}>
                <div className={cn('w-full mx-auto flex justify-center items-center', isAppShell && 'h-full min-h-0')}>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    )
}