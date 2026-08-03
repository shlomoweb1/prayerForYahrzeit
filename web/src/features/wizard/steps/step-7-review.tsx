import { useTranslation } from 'react-i18next'

import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

export function Step7Review({ search }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={7}
      titleKey="wizard.steps.7.title"
      descriptionKey="wizard.steps.7.description"
    >
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t('wizard.labels.target')}</dt>
          <dd>{t(`wizard.options.target.${search.target}`)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t('wizard.labels.gender')}</dt>
          <dd>{t(`wizard.options.gender.${search.gender}`)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t('wizard.labels.nusach')}</dt>
          <dd>{t(`wizard.options.nusach.${search.nusach}`)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t('wizard.labels.name')}</dt>
          <dd dir="rtl" lang="he">
            {search.name || '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t('wizard.labels.parent')}</dt>
          <dd dir="rtl" lang="he">
            {search.parent || '—'}
          </dd>
        </div>
      </dl>
      <div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
        {t('wizard.scaffoldNote', { feature: t('wizard.steps.7.title') })}
      </div>
    </StepShell>
  )
}
