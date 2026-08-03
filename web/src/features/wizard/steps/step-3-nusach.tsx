import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { OptionCard } from '@/components/ui/option-card'
import { RadioGroup } from '@/components/ui/radio-group'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

const NUSACH_ICONS: Record<WizardQuery['nusach'], React.ReactNode> = {
  ashkenaz: <img src="icons/torah/ashkenaz.svg" className="size-48" />,
  sefard: <img src="icons/torah/edot-mizrach.svg" className="size-48" />,
}

export function Step3Nusach({ search, setSearch }: StepProps) {
  const { t, i18n } = useTranslation()

  return (
    <StepShell
      stepNumber={3}
      titleKey="wizard.steps.3.title"
      descriptionKey="wizard.steps.3.description"
    >
      <RadioGroup
        value={search.nusach}
        onValueChange={(value) => setSearch({ nusach: value as WizardQuery['nusach'] })}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label={t('wizard.labels.nusach')}
        dir={i18n.dir()}
      >
        {(['ashkenaz', 'sefard'] as const).map((nusach) => (
          <OptionCard
            key={nusach}
            value={nusach}
            icon={NUSACH_ICONS[nusach]}
            title={t(`wizard.options.nusach.${nusach}`)}
            hint={t(`wizard.hints.nusach.${nusach}`)}
          />
        ))}
      </RadioGroup>
    </StepShell>
  )
}
