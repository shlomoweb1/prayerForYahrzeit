import { useTranslation } from 'react-i18next'

import { MemorialCandle, OrnamentDivider, OrnamentFrame } from '@/components/theme/ornaments'
import { cn } from '@/lib/utils'

/** The landing memorial section card: candle, closing words, and CTAs. */
export function MemorialCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="memorial-title" className={cn('w-full', className)}>
      <OrnamentFrame className="h-full">
        <div className="flex h-full flex-col items-center rounded-md bg-background/85 p-6 text-center backdrop-blur-md sm:p-8">
          <MemorialCandle
            className="absolute bottom-2 inset-e-2 text-gold opacity-70"
            animate={true}
          />
          <h2
            id="memorial-title"
            className="font-display text-balance text-4xl font-bold text-gold sm:text-5xl lang-he:sm:text-2xl lang-he:font-normal"
          >
            {t('landing.memorialTitle')}
          </h2>
          <OrnamentDivider className="" />

          <p className="max-w-xl text-balance text-muted-foreground lg:mt-4">
            {t('landing.memorialText')}
          </p>
        </div>
      </OrnamentFrame>
    </section>
  )
}