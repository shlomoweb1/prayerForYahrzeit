import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

export function Step3Nusach({ search, setSearch }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={3}
      titleKey="wizard.steps.3.title"
      descriptionKey="wizard.steps.3.description"
    >
      <RadioGroup
        value={search.nusach}
        onValueChange={(value) =>
          setSearch({ nusach: value as WizardQuery['nusach'] })
        }
      >
        {(['ashkenaz', 'sefard'] as const).map((nusach) => (
          <div key={nusach} className="flex items-center gap-2">
            <RadioGroupItem value={nusach} id={`nusach-${nusach}`} />
            <Label htmlFor={`nusach-${nusach}`}>
              {t(`wizard.options.nusach.${nusach}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </StepShell>
  )
}
