import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SHOW_AFTER_PX = 96

/**
 * Floating "create prayer" call-to-action. Fades in once the page has been
 * scrolled, so it never covers the hero/primary intent at the top.
 */
export function FloatingPrayerCta({ hidden }: { hidden?: boolean }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed end-6 bottom-6 z-50 print:hidden',
        'transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        hidden && 'hidden',
      )}
    >
      <Button asChild className="shadow-lg">
        <Link to="/wizard">{t('common.cta.create')}</Link>
      </Button>
    </div>
  )
}
