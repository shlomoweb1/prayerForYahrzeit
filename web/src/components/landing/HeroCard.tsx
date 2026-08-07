import { useTranslation } from 'react-i18next'

import { MemorialCandle, OrnamentDivider, OrnamentFrame } from '@/components/theme/ornaments'
import { cn } from '@/lib/utils'

/**
 * The landing hero card: full-bleed art-directed image behind a veil scrim,
 * with the memorial candle and the page title.
 */
export function HeroCard({ className }: { className?: string }) {
  const { t } = useTranslation()


  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        '',
        className,
      )}
    >
      {/* <div aria-hidden className="absolute inset-0 -z-10" style={{ background: 'var(--veil)' }} /> */}
      <OrnamentFrame className="w-full backdrop-blur-md">
        <div className="flex h-full flex-col items-center rounded-md bg-background/85 p-6 text-center backdrop-blur-md sm:p-8">
          <MemorialCandle
            className="absolute bottom-2 inset-e-2 text-gold opacity-70"
            animate={true}
          />
          <h1
            id="hero-title"
            className="font-display text-balance text-gold  text-4xl sm:text-3xl lang-he:font-keter"
          >
            {t('landing.title')}
          </h1>
          <OrnamentDivider className="" />
          
          <p className="max-w-xl text-balance text-lg text-foreground sm:text-xl">
            {t('landing.subtitle')}
          </p>
        </div>
      </OrnamentFrame>
    </section>
  )
}