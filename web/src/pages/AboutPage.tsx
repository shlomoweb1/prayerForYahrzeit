import { useTranslation } from 'react-i18next'

import { OrnamentFrame } from '@/components/theme/ornaments'
import { Card, CardContent } from '@/components/ui/card'
import { BioVersionA } from '@/features/about/bio-versions'
import { ContactModal } from '@/features/about/ContactModal'

const PHOTO_SRC = '/images/protofilio/shlomo_framowitz.png'

export default function AboutPage() {
  const { t } = useTranslation()


  return (
    <div className="flex flex-col gap-6 py-4">
      <header className="flex justify-center">
        <OrnamentFrame className="w-full text-center">
          <div className="rounded-md bg-background/85 px-8 py-3 backdrop-blur-md">
            <h1 className="font-display text-3xl font-bold text-gold lang-he:font-keter">
              {t('aboutPage.title')}
            </h1>
          </div>
        </OrnamentFrame>
      </header>

      <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-5 lg:items-stretch">
        {/* Bio text comes first in reading order, on both layouts. */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <BioVersionA />
          </CardContent>
        </Card>

        {/* Portrait as a framed keepsake, matching the text column's height,
            with a gentle zoom on hover and the contact entry point overlaid
            on desktop, stacked beneath on mobile. */}
        <aside className="flex flex-col items-center gap-4 lg:relative lg:h-full lg:col-span-2">
          <OrnamentFrame className="w-full max-w-xs lg:h-full lg:max-w-none">
            <div className="group h-full overflow-hidden rounded-sm">
              <img
                src={PHOTO_SRC}
                alt={t('aboutPage.photoAlt')}
                className="h-full w-full rounded-sm object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:scale-100! max-lg:h-auto max-lg:aspect-[1008/849] max-lg:max-h-96"
              />
            </div>
          </OrnamentFrame>
          <OrnamentFrame className="w-full max-w-xs  lg:max-w-none">
            <ContactModal />
          </OrnamentFrame>
        </aside>
      </div>
    </div>
  )
}
