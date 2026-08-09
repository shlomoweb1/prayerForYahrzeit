import { useTranslation } from 'react-i18next'

import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const NUSACH_IMAGES: Record<WizardQuery['nusach'], string> = {
  ashkenaz: '/images/Ashkenaz-torah.png',
  ashkenazSefard: '/images/Ashkenaz-torah.png',
  sefard: '/images/separadi-torah.png',
}

export function Step2Nusach({ search, setSearch }: StepProps) {
  const { t, i18n } = useTranslation()

  return (
    <StepShell
      stepNumber={2}
      titleKey="wizard.steps.2.title"
      descriptionKey="wizard.steps.2.description"
    >
      <RadioGroup
        value={search.nusach}
        onValueChange={(value) => setSearch({ nusach: value as WizardQuery['nusach'] })}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label={t('wizard.labels.nusach')}
        dir={i18n.dir()}
      >
        {(['ashkenaz', 'ashkenazSefard', 'sefard'] as const).map((nusach) => (
          <OptionCard
            key={nusach}
            value={nusach}
            image={NUSACH_IMAGES[nusach]}
            title={t(`wizard.options.nusach.${nusach}`)}
            hint={t(`wizard.hints.nusach.${nusach}`)}
          />
        ))}
      </RadioGroup>
    </StepShell>
  )
}
