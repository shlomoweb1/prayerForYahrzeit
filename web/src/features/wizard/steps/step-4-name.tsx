import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

export function Step4Name({ search, setSearch }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={4}
      titleKey="wizard.steps.4.title"
      descriptionKey="wizard.steps.4.description"
    >
      <div className="grid gap-2">
        <Label htmlFor="wizard-name">{t('wizard.labels.name')}</Label>
        <Input
          id="wizard-name"
          dir="rtl"
          lang="he"
          autoComplete="off"
          value={search.name ?? ''}
          onChange={(event) => setSearch({ name: event.target.value })}
          placeholder={t('wizard.placeholders.name')}
        />
      </div>
    </StepShell>
  )
}
