import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

export function Step2Gender({ search, setSearch }: StepProps) {
  const { t } = useTranslation()

  return (
    <StepShell
      stepNumber={2}
      titleKey="wizard.steps.2.title"
      descriptionKey="wizard.steps.2.description"
    >
      <RadioGroup
        value={search.gender}
        onValueChange={(value) =>
          setSearch({ gender: value as WizardQuery['gender'] })
        }
      >
        {(['male', 'female'] as const).map((gender) => (
          <div key={gender} className="flex items-center gap-2">
            <RadioGroupItem value={gender} id={`gender-${gender}`} />
            <Label htmlFor={`gender-${gender}`}>
              {t(`wizard.options.gender.${gender}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </StepShell>
  )
}
