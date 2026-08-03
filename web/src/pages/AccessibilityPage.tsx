import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const FEEDBACK_EMAIL = 'accessibility@izkor.example'
const LAST_AUDIT_DATE = '2026-08-02'
const STATEMENT_DATE = '2026-08-02'
const FEATURE_ITEM_KEYS = [
  'widget',
  'keyboard',
  'languages',
  'scaling',
  'contrast',
  'nomouse',
] as const
const LIMITATION_ITEM_KEYS = ['pdf', 'srMatrix'] as const

export default function AccessibilityPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('accessibilityPage.title')}</h1>
        <dl className="text-muted-foreground flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <div className="flex gap-2">
            <dt>{t('accessibilityPage.updatedAt')}:</dt>
            <dd>{STATEMENT_DATE}</dd>
          </div>
          <div className="flex gap-2">
            <dt>{t('accessibilityPage.lastAudit')}:</dt>
            <dd>{LAST_AUDIT_DATE}</dd>
          </div>
        </dl>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t('accessibilityPage.conformanceTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{t('accessibilityPage.conformanceBody')}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('accessibilityPage.featuresTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground grid gap-2 text-sm">
            {FEATURE_ITEM_KEYS.map((key) => (
              <li key={key}>{t(`accessibilityPage.featuresItems.${key}`)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('accessibilityPage.limitationsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground grid gap-2 text-sm">
            {LIMITATION_ITEM_KEYS.map((key) => (
              <li key={key}>{t(`accessibilityPage.limitationsItems.${key}`)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('accessibilityPage.feedbackTitle')}</CardTitle>
          <CardDescription>{t('accessibilityPage.feedbackBody')}</CardDescription>
        </CardHeader>
        <CardContent>
          <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>
        </CardContent>
      </Card>
    </div>
  )
}
