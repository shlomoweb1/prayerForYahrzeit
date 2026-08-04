import { useTranslation } from 'react-i18next'

import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const GENDER_IMAGES: Record<WizardQuery['gender'], string> = {
  male: '/images/male.png',
  female: '/images/female.png',
}

export function Step1Gender({ search, setSearch }: StepProps) {
  const { t, i18n } = useTranslation()

  return (
    <StepShell
      stepNumber={1}
      titleKey="wizard.steps.1.title"
      descriptionKey="wizard.steps.1.description"
    >
      <RadioGroup
        value={search.gender}
        onValueChange={(value) => setSearch({ gender: value as WizardQuery['gender'] })}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label={t('wizard.labels.gender')}
        dir={i18n.dir()}
      >
        {(['male', 'female'] as const).map((gender) => (
          <OptionCard
            key={gender}
            value={gender}
            image={GENDER_IMAGES[gender]}
            title={t(`wizard.options.gender.${gender}`)}
            hint={t(`wizard.hints.gender.${gender}`)}
          />
        ))}
      </RadioGroup>
    </StepShell>
  )
}
