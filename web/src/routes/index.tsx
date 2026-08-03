import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FEATURE_ITEM_KEYS = ['simple', 'preview', 'pdf', 'share'] as const

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance">
          {t('landing.title')}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">{t('landing.subtitle')}</p>
        <Button asChild size="lg">
          <Link to="/wizard">{t('landing.ctaStart')}</Link>
        </Button>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>{t('landing.howItWorksTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3">
            {FEATURE_ITEM_KEYS.map((key) => (
              <li key={key} className="text-muted-foreground text-sm">
                {t(`landing.featureItems.${key}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
