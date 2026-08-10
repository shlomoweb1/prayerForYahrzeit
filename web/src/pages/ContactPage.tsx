import { useTranslation } from 'react-i18next'

import { OrnamentFrame } from '@/components/theme/ornaments'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/features/about/ContactForm'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6 py-4">
      <header className="flex justify-center">
        <OrnamentFrame className="w-full text-center">
          <div className="rounded-md bg-background/85 px-8 py-3 backdrop-blur-md">
            <h1 className="font-display text-3xl font-bold text-gold lang-he:font-keter">
              {t('contactPage.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">{t('contactPage.intro')}</p>
          </div>
        </OrnamentFrame>
      </header>

      <Card className="mx-auto w-full max-w-lg">
        <CardContent className="pt-6">
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  )
}
