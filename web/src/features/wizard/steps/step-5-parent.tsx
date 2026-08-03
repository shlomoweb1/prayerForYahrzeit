import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

export function Step5Parent({ search, setSearch }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={5}
      titleKey="wizard.steps.5.title"
      descriptionKey="wizard.steps.5.description"
    >
      <div className="grid gap-2">
        <Label htmlFor="wizard-parent">{t('wizard.labels.parent')}</Label>
        <Input
          id="wizard-parent"
          dir="rtl"
          lang="he"
          autoComplete="off"
          value={search.parent ?? ''}
          onChange={(event) => setSearch({ parent: event.target.value })}
          placeholder={t('wizard.placeholders.parent')}
        />
      </div>
    </StepShell>
  )
}
