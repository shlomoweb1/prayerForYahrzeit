import { useTranslation } from 'react-i18next'

import { OrnamentFrame } from '@/components/theme/ornaments'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'

const FEATURE_ITEM_KEYS = ['simple', 'preview', 'pdf', 'share'] as const

const FEATURE_GLYPHS = ['✶', '❖', '✠', '✦']

/** The landing "how it works" card: the four step highlights. */
export function HowItWorksCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="how-it-works-title" className={cn('w-full', className)}>
      <OrnamentFrame className="h-full">
        <div className="flex h-full flex-col rounded-md bg-background/85 p-6 backdrop-blur-md sm:p-8">
          <h2
            id="how-it-works-title"
            className="text-center text-2xl font-bold text-foreground sm:text-3xl"
          >
            {t('landing.howItWorksTitle')}
          </h2>
          <div className="flex flex-col gap-y-8">
            <p className="text-balance text-center text-muted-foreground">
              {t('landing.howItWorksIntro')}
            </p>
            <ul className="grid gap-6">
              {FEATURE_ITEM_KEYS.map((key, index) => (
                <li key={key} className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold text-gold"
                  >
                    {FEATURE_GLYPHS[index]}
                  </span>
                  <span>
                    <span className="block font-semibold text-foreground">
                      {t(`landing.featureTitles.${key}`)}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {t(`landing.featureItems.${key}`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="lg:mt-4">
              <Link to="/wizard" className="no-underline">
                {t('landing.ctaStart')}
              </Link>
            </Button>
          </div>
        </div>
      </OrnamentFrame>
    </section>
  )
}