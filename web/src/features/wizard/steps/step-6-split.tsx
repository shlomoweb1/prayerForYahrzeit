import { useTranslation } from 'react-i18next'

import type { StepProps } from '@/features/wizard/step-registry'
import { StepShell } from '@/features/wizard/steps/step-shell'

export function Step6Split(_props: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={6}
      titleKey="wizard.steps.6.title"
      descriptionKey="wizard.steps.6.description"
    >
      <div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
        {t('wizard.scaffoldNote', { feature: t('wizard.steps.6.title') })}
      </div>
    </StepShell>
  )
}
